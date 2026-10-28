// Records banner.html into the README banner: ../assets/banner.gif (the animation, 1000x300) and
// ../assets/banner.png (one still frame at 2x, 2000x600). Both are 10:3.
//
//   node .github/banner/record.mjs        (`just banner` from the repo root)
//
// Needs Chrome, Edge or Chromium (set BROWSER to its path if it is not found) and ffmpeg on PATH; the fonts come
// from the website's prebuild (`just site-build` once). Node only, no packages: the browser is driven over the
// DevTools protocol with Node's built-in WebSocket. Runs on Windows, Linux and macOS.

import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const assets = join(here, '..', 'assets');
const WIDTH = 1000;
const HEIGHT = 300;
const FPS = 20;
const CYCLE = 5.2; // seconds, as in banner.html
const STILL = 1.0; // the still frame: the blocks have landed
const PORT = 9333;

function browserPath() {
  if (process.env.BROWSER) return process.env.BROWSER;
  const candidates = {
    win32: [
      'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
      'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
      'C:/Program Files/Google/Chrome/Application/chrome.exe',
    ],
    darwin: [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
    ],
    linux: ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge'],
  }[process.platform] ?? [];
  const found = candidates.find((p) => existsSync(p));
  if (!found) throw new Error('no Chrome, Edge or Chromium found; set BROWSER to its path');
  return found;
}

/** A DevTools connection: send(method, params) resolves with the result; once(event) with its params. */
async function connect(url) {
  const ws = new WebSocket(url);
  await new Promise((ok, fail) => { ws.onopen = ok; ws.onerror = fail; });
  let next = 0;
  const pending = new Map();
  const waiting = new Map();
  ws.onmessage = ({ data }) => {
    const msg = JSON.parse(data);
    if (msg.id !== undefined) {
      const p = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) p.fail(new Error(`${msg.error.message} (${p.method})`));
      else p.ok(msg.result);
    } else if (waiting.has(msg.method)) {
      waiting.get(msg.method)(msg.params);
      waiting.delete(msg.method);
    }
  };
  return {
    // Every call fails after 20 s instead of hanging the run.
    send: (method, params = {}) => new Promise((ok, fail) => {
      next += 1;
      const id = next;
      const timer = setTimeout(() => { pending.delete(id); fail(new Error(`${method} timed out`)); }, 20_000);
      pending.set(id, { ok: (v) => { clearTimeout(timer); ok(v); }, fail: (e) => { clearTimeout(timer); fail(e); }, method });
      ws.send(JSON.stringify({ id, method, params }));
    }),
    once: (method) => new Promise((ok) => waiting.set(method, ok)),
    close: () => ws.close(),
  };
}

async function pageSocket() {
  for (let i = 0; i < 100; i += 1) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = list.find((t) => t.type === 'page');
      if (page) return page.webSocketDebuggerUrl;
    } catch {
      // The browser is still starting.
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error('the browser did not open its DevTools port');
}

async function main() {
  const profile = mkdtempSync(join(tmpdir(), 'fdm-banner-profile-'));
  const frames = mkdtempSync(join(tmpdir(), 'fdm-banner-frames-'));
  const browser = spawn(browserPath(), [
    '--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
    '--hide-scrollbars', '--force-color-profile=srgb', '--no-first-run', 'about:blank',
  ], { stdio: 'ignore' });
  try {
    const cdp = await connect(await pageSocket());
    await cdp.send('Page.enable');
    // The pixel size comes from the device scale factor set below; the clip stays at scale 1.
    const capture = async () => Buffer.from((await cdp.send('Page.captureScreenshot', {
      format: 'png', clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT, scale: 1 },
    })).data, 'base64');
    // Draws time t and returns a frame only when two captures in a row are identical (each capture paints the
    // page anew): a single capture once came back with the page drawn in the wrong place, a one-frame flash over
    // the logo in the GIF. (Waiting for requestAnimationFrame instead hangs in headless mode.)
    const shot = async (t) => {
      await cdp.send('Runtime.evaluate', {
        expression: `render(${t})`,
      });
      let last = await capture();
      for (let tries = 0; tries < 8; tries += 1) {
        const next = await capture();
        if (next.equals(last)) return next;
        last = next;
      }
      throw new Error(`frame at ${t} s never came out the same twice`);
    };
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1, mobile: false });
    const loaded = cdp.once('Page.loadEventFired');
    await cdp.send('Page.navigate', { url: `${pathToFileURL(join(here, 'banner.html')).href}?still` });
    await loaded;
    const fonts = await cdp.send('Runtime.evaluate', {
      expression: `const fonts = ['700 64px Geist', '500 14px "Geist Mono"'];
        Promise.all(fonts.map((f) => document.fonts.load(f)))
          .then(() => document.fonts.ready).then(() => fonts.every((f) => document.fonts.check(f)))`,
      awaitPromise: true, returnByValue: true,
    });
    if (fonts.result.value !== true) throw new Error('Geist did not load; run the website build once (just site-build)');

    const count = Math.round(CYCLE * FPS);
    for (let i = 0; i < count; i += 1) {
      writeFileSync(join(frames, `frame-${String(i).padStart(3, '0')}.png`), await shot(i / FPS));
      if (i % 20 === 0) console.log(`banner: frame ${i + 1} of ${count}`);
    }
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: WIDTH, height: HEIGHT, deviceScaleFactor: 2, mobile: false });
    mkdirSync(assets, { recursive: true });
    writeFileSync(join(assets, 'banner.png'), await shot(STILL));
    cdp.close();

    const ffmpeg = spawnSync('ffmpeg', [
      '-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(frames, 'frame-%03d.png'),
      '-vf', 'split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle',
      // No `offsetting` (storing only the changed rectangle of a frame): ffmpeg placed one rectangle wrong and
      // a piece of the title flashed over the logo for a frame. `transdiff` still keeps unchanged pixels small.
      '-gifflags', '-offsetting+transdiff', '-loop', '0', join(assets, 'banner.gif'),
    ], { stdio: 'inherit' });
    if (ffmpeg.error) throw new Error(`ffmpeg did not run: ${ffmpeg.error.message}`);
    if (ffmpeg.status !== 0) throw new Error(`ffmpeg failed with ${ffmpeg.status}`);
    console.log(`banner: ${count} frames -> .github/assets/banner.gif, still -> .github/assets/banner.png`);
  } finally {
    browser.kill();
    rmSync(frames, { recursive: true, force: true });
    setTimeout(() => rmSync(profile, { recursive: true, force: true, maxRetries: 5 }), 500);
  }
}

main().catch((err) => {
  console.error(`banner: ${err.message}`);
  process.exitCode = 1;
});
