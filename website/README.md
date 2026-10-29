# website

The public product website for Fast Download Manager: [Fumadocs](https://fumadocs.dev) 16.17 on
[TanStack Start](https://tanstack.com/start) (Vite 8), React 19 and Tailwind CSS 4, **fully prerendered** to
`out/` (plain files for any static host, no server) and deployed to Cloudflare at https://fdm.naz.ovh (see
Deploy). Search is Fumadocs' static Orama index. Package manager: **pnpm** (the browser extension keeps npm).
It moved from Next.js to TanStack Start on 2026-10-25 (owner's request); see "How the static build works".

| route | what | owner |
| --- | --- | --- |
| `/` and `/home` | Product landing page. `/home` re-exports the `/` page (a static export has no redirects). | landing |
| `/download` | Every download option, read from `src/lib/downloads.ts`. Unbuilt packages show "coming soon". | download |
| `/docs` | Documentation: the user guide (written here). | docs |

Public pages (landing, download, user guide) never mention other download managers by name, and claim no
price, license or numbers the repo docs do not state. Allowed numbers: 32 connections, 39 app languages,
17 extension languages, 4 browsers.

## Commands

```sh
cd website
pnpm install   # once, and after package.json changes
pnpm dev       # prebuild scripts, then vite dev at http://localhost:3000
pnpm build     # prebuild scripts, then vite build + prerender -> out/ (about 15 s)
pnpm check     # prebuild scripts, route tree, tsc --noEmit
pnpm start     # serve out/ locally (after a build); pnpm start -l 3100 picks the port
pnpm cf:dry-run  # check the Cloudflare deploy without deploying (see Deploy below)
```

From the repo root (this repo's `justfile`): `just site-install`, `just site-dev`, `just site-build`, `just site-check`,
`just site-dry-run`, `just site-deploy` (Cloudflare, see Deploy).

The prebuild step (`scripts/prebuild/index.mjs`) runs before `dev`, `build` and `check`: it writes the
version (the newest file in `../changelog`) and fetches the Geist fonts (first run only). `pnpm build`
prints two CSS warnings while optimizing the generated CSS (Fumadocs' `::highlight(fd-search)` classes); they are
harmless.

### Parallel work: ports

Several agents can run dev servers side by side: each takes its own port (`pnpm dev --port 3101`). `vite dev`
writes no build output, so dev servers do not collide. Only one agent at a time runs `pnpm build` (it writes
`out/` and `dist/`).

**Stopping servers:** start yours in the background, record its pid, and stop only that pid and its child
processes. Never stop processes by name or command-line pattern (`Stop-Process -Name node`, `taskkill /IM`,
`pkill -f vite`): that also ends the owner's unrelated dev servers.

### Screenshots

Use headless Edge, never the owner's browser:

```pwsh
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --disable-gpu --hide-scrollbars `
  --user-data-dir=<scratch>\edge-<name> --window-size=1440,1000 --virtual-time-budget=8000 `
  --screenshot=<scratch>\shot.png http://localhost:3100/
```

Headless Edge does not make a window narrower than 492 px, so for phone widths (360, 390) and for dark mode
drive it over the DevTools protocol instead: start Edge with `--remote-debugging-port`, then send
`Emulation.setDeviceMetricsOverride` (width 390, `mobile: true`), `Emulation.setEmulatedMedia`
(`prefers-color-scheme: dark`, `prefers-reduced-motion: reduce`), pause `document.getAnimations()` at a chosen
time, and `Page.captureScreenshot`. A small Node script does this with Node's built-in `WebSocket` and `fetch`
(no packages); keep it in your scratch folder, not in the repo. Give each run its own `--user-data-dir` (two
runs on one profile fail). Open every screenshot and look at it.

## Deploy (Cloudflare)

Production is **https://fdm.naz.ovh**, served by a Cloudflare Worker named `fdm-website` with **static assets
only**: no Worker script, Cloudflare serves the files in `out/` directly. Config: `wrangler.jsonc`. The
`naz.ovh` zone is on the same Cloudflare account, so the first deploy creates the `fdm.naz.ovh` DNS record and
its certificate (it fails if a CNAME for `fdm` already exists; delete it first). `workers_dev: false`: the
site answers only on its domain.

Wrangler is **not** a dependency: the scripts run it with `pnpm dlx wrangler@4` (latest 4.x, fetched into
pnpm's store, the lockfile untouched; it pulls Cloudflare's `workerd` binary, about 35 MB on Windows). Making
it a devDependency needs the owner's yes. pnpm runs no install scripts it was not told to, and would stop to ask
about Wrangler's two (`esbuild` checks its binary, `workerd` fetches its own), so the scripts pass
`--allow-build=esbuild --allow-build=workerd` and the deploy runs without a prompt.

```sh
pnpm cf:dry-run    # validate wrangler.jsonc and read out/ (no login, creates nothing); run pnpm build first
pnpm cf:deploy     # pnpm build, then wrangler deploy (needs a login, below)
```

**(a) From this machine**

1. `pnpm dlx wrangler@4 login` once (opens the browser for Cloudflare OAuth). In CI or without a browser, set
   `CLOUDFLARE_API_TOKEN` (dashboard template "Edit Cloudflare Workers", with the `naz.ovh` zone included) and
   `CLOUDFLARE_ACCOUNT_ID` instead.
2. `just site-deploy` from the repo root (or `pnpm cf:deploy` here). The first run creates the Worker, the
   DNS record and the certificate (the certificate can take a few minutes).

**(b) Git-connected Workers Builds (builds on every push)**

`wrangler.jsonc` must be on the branch first: when the root directory has no Wrangler config, Cloudflare's
automatic configuration opens a pull request that converts the site to its own framework adapter.

1. Cloudflare dashboard: Workers & Pages → Create → Import a repository → GitHub → install or authorize the
   Cloudflare GitHub app for `Naz-Ovh/Fast-Download-Manager` (the public repo this site lives in).
2. Worker name `fdm-website` (it must match `name` in `wrangler.jsonc`, or the build fails). Production
   branch `main`.
3. Root directory `website`; build command `pnpm build`; deploy command `pnpm dlx wrangler@4 deploy`;
   non-production branch (preview) command `pnpm dlx wrangler@4 preview` (Previews need Wrangler 4.135+).
4. Build variables: `PNPM_VERSION=12.11.2` (the build image ships pnpm 10.11.1; `packageManager` in
   `package.json` also asks for 12.11.2). Node: the image defaults to Node 24.18.0, which Vite 8 accepts
   (20.19+ or 22.12+); set `NODE_VERSION` only to change it. We use Node 26 locally.
5. Settings → Build → Build watch paths: include `website/*` and `changelog/*` (the prebuild reads the version
   from the newest release notes file).
6. Save and Deploy. Pushes to `main` deploy production; other branches build a Preview (URL under the Worker's
   Previews).

**What the deploy carries**

- `public/_headers` (copied to `out/_headers`, parsed by Cloudflare, not served): `/assets/*` (Vite's hashed
  JS, CSS and fonts) immutable for a year, `/brand/*` a day, `/api/search` an hour with a JSON content type (it has no file
  extension, and the type lets Cloudflare compress the 3 MB index), and on every path `nosniff`,
  `strict-origin-when-cross-origin`, `X-Frame-Options: DENY` and a `Permissions-Policy` that turns off camera,
  microphone and geolocation. No Content-Security-Policy: the router's inline hydration scripts would break. Limits: 100
  rules, 2,000 characters a line.
- `src/routes/robots[.]txt.ts` → `/robots.txt` (allow everything, points at the sitemap) and
  `src/routes/sitemap[.]xml.ts` → `/sitemap.xml` (`/`, `/download/` and every docs page, absolute `https://fdm.naz.ovh/.../` URLs; `/home/` is
  left out because it duplicates `/`). Both use `site.url`.
- Canonicals (`pageHead()` in `src/lib/head.ts`, absolute with `site.url`): `/` and `/home/` point at `/`, `/download/` and every docs
  page at themselves (with the trailing slash).
- `html_handling: auto-trailing-slash` serves `route/index.html` at `/route/` (and redirects `/route`);
  `not_found_handling: 404-page` answers unknown paths with `out/404.html` and status 404 (how that file is
  made: "How the static build works").

**Roll back:** `pnpm dlx wrangler@4 deployments list`, then `pnpm dlx wrangler@4 rollback [version-id]` (no id:
the previous version), or in the dashboard: the Worker → Deployments → pick a version → Rollback.

## Tree

```
website/
├── README.md                     this file
├── package.json                  scripts and the template's dependencies (no others without the owner's yes)
├── pnpm-lock.yaml                committed lockfile (pnpm)
├── pnpm-workspace.yaml           pnpm settings: dependency build scripts stay off (esbuild's is denied)
├── wrangler.jsonc                Cloudflare Workers static assets: out/, 404 page, fdm.naz.ovh (see Deploy)
├── vite.config.ts                Fumadocs MDX, Tailwind, TanStack Start (prerender list), React; client output -> out/
├── tsconfig.json                 TypeScript, `@/*` -> `src/*`, Vite client types
├── content/
│   ├── README.md                 the docs content: pages, order, writing rules
│   └── docs/
│       ├── meta.json             top-level order: index, guide
│       ├── index.mdx             docs home (/docs/): hero, EntryCards, MoreLinks
│       └── guide/                tab "Guide": 10 user pages + meta.json (root: true); list in content/README.md
├── scripts/
│   ├── route-tree.mjs            writes src/routeTree.gen.ts without a build (for `pnpm check`)
│   └── prebuild/                 build-time work, Node only, runs before dev/build/check
│       ├── index.mjs             runs every step below
│       ├── version.mjs           newest ../changelog/<x.y.z>.md -> src/generated/build.json
│       └── fonts.mjs             Geist + Geist Mono woff2 from Google Fonts -> src/generated/fonts/ (cached)
├── public/_headers               Cloudflare cache and security headers (copied to out/)
├── public/brand/, public/icon.svg  the app icon (copies of the app repo's assets/brand) and the favicon
└── src/
    ├── router.tsx                the router: trailing slashes always, NotFound for unknown URLs
    ├── start.ts                  request middleware: lets the build write out/404.html (see below)
    ├── routeTree.gen.ts          generated from src/routes by TanStack (git-ignored)
    ├── styles/global.css         design system: tokens, Fumadocs colors, components, backgrounds, motion, route line
    ├── routes/
    │   ├── __root.tsx            <html>, default head tags, global.css, fonts, favicon, RouteProgress, RootProvider
    │   ├── _home.tsx             pathless layout: HomeLayout (navbar) + Footer
    │   ├── _home/index.tsx       / (the landing page, components/landing/home-page.tsx)
    │   ├── _home/home.tsx        /home: the same page and head tags
    │   ├── _home/download.tsx    download: hero, matrix, in the box, steps, requirements, checksums
    │   ├── docs/$.tsx            DocsLayout + one docs page (static server function loader); the docs home gets
    │   │                         DocsHero, no TOC or breadcrumb
    │   ├── robots[.]txt.ts, sitemap[.]xml.ts  /robots.txt and /sitemap.xml from site.url
    │   ├── api/search.ts         static Orama search index (staticGET -> out/api/search)
    │   └── llms[.]txt.ts, llms-full[.]txt.ts, llms[.]mdx/docs/$.ts   plain-text docs for LLM tools
    ├── components/
    │   ├── brand/logo.tsx        <Logo>: the icon.svg rects inline
    │   ├── brand/wordmark.tsx    <Wordmark>: logo + "Fast Download Manager" ("FDM" on phones with compact)
    │   ├── ui/                   shared primitives (table below), incl. route-progress.tsx
    │   ├── landing/              the landing page (prefix lp-, styles in landing.css)
    │   │   ├── landing.css       ink scope, buttons, Boot, Download Stage, ticker, Race, cards, video, reduced motion
    │   │   ├── home-page.tsx     the landing page (sections in order) and its head tags, for / and /home
    │   │   ├── hero.tsx          ink stage hero: Boot streaks, speed-blur headline, lead, CTAs, the stage
    │   │   ├── download-stage.tsx  hero visual: 8 lanes fill and merge, "Complete"; percent and clock in CSS
    │   │   ├── cursor-glow.tsx   (client) mint glow following the pointer over the hero
    │   │   ├── cta-buttons.tsx   download (shine sweep, arrow nudge) and docs buttons
    │   │   ├── chunk-mark.tsx    the icon with its three arriving blocks in their own group, for animation
    │   │   ├── ticker.tsx        capabilities marquee (~18 s loop, pauses on hover)
    │   │   ├── race-section.tsx  "Why it feels fast": the parallel-segments text next to the Race
    │   │   ├── race.tsx          (client) one connection against eight, starts in view, Replay button
    │   │   ├── features.tsx      eight feature cards, revealed with a 40 ms stagger
    │   │   ├── how-it-works.tsx  three steps with small CSS illustrations
    │   │   ├── video-section.tsx CSS-drawn player with the in-page button and its quality menu
    │   │   ├── platforms.tsx     Windows now, Linux and macOS coming, the fdm terminal card
    │   │   └── final-cta.tsx     closing call to action on an ink panel
    │   ├── download/             the download page (prefix dl-, styles in download.css)
    │   │   ├── download.css      hero stage, boot, primary button, matrix, terminal, tabs, reduced motion
    │   │   ├── hero.tsx          ink stage hero with a CSS boot and the OS-aware primary button
    │   │   ├── primary-cta.tsx   (client) the big button for the visitor's OS: available (file, size, SHA-256) or coming soon
    │   │   ├── use-platform.ts   (client hook) the visitor's OS after hydration; the server HTML says Windows
    │   │   ├── matrix.tsx        "All downloads": one card per OS, the browser extension and CLI cards
    │   │   ├── sections.tsx      in the box, install steps, requirements, verify
    │   │   ├── checksums.tsx     (client) SHA-256 command per OS; tabs on phones
    │   │   ├── command.tsx       terminal box with a copy button; dimmed with "soon" when not released
    │   │   └── os-icon.tsx       generic OS glyphs in lucide's stroke style (no vendor logos)
    │   ├── docs/                 the docs area (styles in docs.css)
    │   │   ├── docs.css          page reveal, sidebar streak, search glow, page chrome, docs home, reduced motion
    │   │   ├── docs-hero.tsx     docs home header with the chunk lane motif
    │   │   ├── entry-cards.tsx   EntryCards (Install, Browser extension, Video) and MoreLinks
    │   │   └── repo-link.tsx     <RepoLink path="/issues"> for MDX (reads site.repo)
    │   ├── provider.tsx          RootProvider (TanStack adapter) with the static search dialog
    │   ├── not-found.tsx         navbar, "not found" message, footer (unknown URLs and out/404.html)
    │   ├── search.tsx            search dialog (useStaticSearch)
    │   └── mdx.tsx               MDX component map (Fumadocs defaults, Steps, Tabs, EntryCards, MoreLinks, RepoLink)
    ├── generated/                build.json { version, builtAt } and fonts/ (git-ignored)
    └── lib/
        ├── site.ts               name, tagline, description, url, repo, version, navLinks
        ├── head.ts               pageHead(): title, description, canonical and stylesheets of a route
        ├── downloads.ts          typed download list, platform facts, releaseUrl(), downloadsByOs(), primaryDownload
        ├── layout.shared.tsx     baseOptions(): navbar title, links, GitHub link
        ├── docs.ts               docs collection (fumadocs-mdx macro API, no source.config.ts); MDX loads per page
        ├── source.ts             Fumadocs loader over it (page tree, search, llms); build side only
        ├── shared.ts             docs routes, markdown URL helper, page source links
        └── cn.ts                 class name joiner
```

Generated and git-ignored (the repo's `.gitignore`): `node_modules/`, `out/`, `dist/`, `.tanstack/`,
`.source/`, `.wrangler/`, `*.tsbuildinfo`, `src/generated/`, `src/routeTree.gen.ts`.

## How the static build works

`vite build` builds the client (`out/`) and a server bundle (`dist/server/`, used only during the build), then
TanStack Start's prerenderer starts that bundle, requests every page listed in `vite.config.ts` and writes the
answers into `out/`. Nothing runs on a server afterwards.

- **Which pages:** `/`, `/home`, `/download`, the text files (`/api/search`, `/robots.txt`, `/sitemap.xml`,
  `/llms.txt`, `/llms-full.txt`), and every docs page with its Markdown copy, read from `content/docs`. Listed up front, not crawled from links. HTML is written as `route/index.html`;
  any other response at its exact path (`out/api/search`, `out/robots.txt`).
- **Docs navigation:** the docs route's loader is a static server function (`staticFunctionMiddleware`). The
  build writes each result (page facts and the serialized page tree) to `out/__tsr/staticServerFnCache/*.json`;
  client-side navigation fetches those. A full page load gets the same data inline in the HTML. Each page's MDX
  is its own lazy chunk (`async: true` in `src/lib/docs.ts`); the Fumadocs loader (`src/lib/source.ts`) is
  imported only by server functions and server routes, so it stays out of the client bundle.
- **The 404 page:** the build requests `/404`, which no route matches, so the router renders its own not-found
  branch. `src/start.ts` lets that one response through as 200 (the prerenderer writes only 200s) and it lands
  in `out/404.html`. Because it is the same tree the client renders at any unknown URL, the page hydrates
  without a mismatch. (A `/404` route would render a different tree and fail to hydrate.)
- **Head tags:** routes set them with `head()`; `pageHead()` adds the title template, description, canonical
  and the route's stylesheets (`import css from '<file>.css?url'`). HeadContent keeps one tag per meta name, so
  the two `theme-color` tags are written straight into `<head>` in `__root.tsx`.
- **Links:** components use `fumadocs-core/link` (`href` prop). Every Fumadocs link (sidebar, MDX, cards) goes
  through the `Link` in `src/components/provider.tsx`, which hands the router the path, query and `#hash`
  separately: Fumadocs' own TanStack link passes the whole href as the path, so `/docs/a/#part` became
  `/docs/a/#part/` and never reached its heading. `trailingSlash: 'always'` in `src/router.tsx` matches the
  static files.
- **Fonts:** `scripts/prebuild/fonts.mjs` does what `next/font/google` did: downloads Geist and Geist Mono once
  (variable woff2, every subset Google serves) and writes `@font-face` rules; Vite ships them hashed under
  `/assets/`, and the two latin files are preloaded. Offline with no cached copy the site uses system fonts and
  the step says so.

## Downloads data (`src/lib/downloads.ts`): honest states

Every package row is `status: 'soon'` today, and pages never link a `soon` URL. When a package ships, flip its
row: `status: 'available'`, a working `url`, and the real `size` and `sha256` measured from the released file
(the download page shows both). Never write a placeholder size or hash. Only the Windows `.msi` file name is
fixed by the packager (`crates/fdm-pack`); the Linux and macOS names are proposals until their packagers exist.

## Search index

`/api/search` is one static JSON file (Orama) of the guide pages. The search dialog loads it when it first
opens, not with the page. `serve` sends it without a JSON content type; the client parses it anyway.

## Shared primitives (`src/components/ui`, `src/components/brand`)

| import | props |
| --- | --- |
| `Container` | `as?`, HTML attrs. 1200px column, 16px gutters on phones. |
| `Section` | `id?`, `eyebrow?`, `title?`, `lead?`, `align?: 'left'\|'center'`, `level?: 1\|2\|3`, `containerClassName?` |
| `Button`, `buttonClass()` | `variant?: 'primary'\|'secondary'\|'ghost'`, `size?: 'sm'\|'md'\|'lg'`; with `href` a link (`external?`), else a `<button>` |
| `Card` | `as?`, `href?`, `interactive?` (hover lift + mint ring), `padding?: 'none'\|'sm'\|'md'\|'lg'` |
| `Badge`, `statusLabel` | `variant?: 'available'\|'soon'\|'neutral'`, `dot?` |
| `Reveal` (client) | `as?`, `delay?` ms, `stagger?` ms (reveals direct children one by one; use 40). Only elements below the fold at load are hidden; give the hero its own CSS animation. |
| `CountUp` (client) | `value`, `duration?` (600), `decimals?`, `prefix?`, `suffix?` |
| `CopyButton` (client) | `text`, `label?`, `ariaLabel?` |
| `Footer` | none |
| `RouteProgress` (client) | none. Mounted once in `src/routes/__root.tsx`: the 2 px mint line on route changes (not on the first load). |
| `Logo` | `size?` (32), `title?` (accessible name; decorative when empty), SVG attrs |
| `Wordmark` | `size?` (24), `compact?` ("FDM" below sm) |

## Design tokens (`src/styles/global.css`)

| token | light | dark | use |
| --- | --- | --- | --- |
| `--color-fd-background` | `#F7FBF9` | `#0A1416` | page |
| `--color-fd-card` / `--fdm-surface` | `#FFFFFF` | `#0F1D20` | cards |
| `--fdm-surface-2` / `--color-fd-muted` | `#F1F7F4` / `#EEF5F2` | `#13262A` | panels, code |
| `--color-fd-border` | `rgba(13,27,30,.08)` | `rgba(124,245,198,.10)` | 1px borders |
| `--color-fd-foreground` | `#0D1B1E` | `#E6F2EE` | text |
| `--color-fd-muted-foreground` | `#4E6660` | `#8FA8A1` | secondary text |
| `--color-fd-primary` | `#0CA678` | `#20C997` | fills, buttons, large text |
| `--fdm-primary-text` | `#087F5B` | `#45E0B0` | small mint text (AA) |
| `--fdm-glow` | `#20C997` | `#7CF5C6` | glow, highlights |
| `--fdm-ink`, `--fdm-mint-300` ... `-900` | icon colors | same | raw brand (also Tailwind `bg-fdm-mint-500` etc.) |

Tailwind colors: `fd-*` (Fumadocs), `fdm-ink`, `fdm-mint-{300..900}`, `fdm-surface`, `fdm-surface-2`,
`fdm-border-strong`, `fdm-primary-text`, `fdm-glow`, `fdm-tint`. Radius 16px cards, 12px panels (`.fdm-panel`),
8px controls, 999px pills. Fonts: Geist (`font-sans`) and Geist Mono (`font-mono`).

Classes: `.fdm-heading` (600, -0.02em, 1.05), `.fdm-hero-title` (clamp 2.5-4.5rem), `.fdm-eyebrow`, `.fdm-num`
(mono, tabular), `.fdm-panel`, utilities `fdm-bg-dots`, `fdm-bg-grid`, `fdm-bg-glow`, `fdm-mask-fade`.
Motion: keyframes `fdm-reveal`, `fdm-fade`, `fdm-count`, `fdm-streak`, `fdm-chunk-in`, `fdm-route-run`/`fdm-route-out`; easing
`var(--fdm-ease)` / Tailwind `ease-fdm`; `--fdm-dur-fast` 120ms, `--fdm-dur-reveal` 220ms. Under
`prefers-reduced-motion` reveals fade only and anything with `.fdm-streak` is hidden. Reveals use fill mode
`backwards`, so a revealed card keeps its hover lift; use `backwards` (not `both`) for any entrance animation on
an element that moves on hover.

## Rules for this folder

- **No new dependencies without the owner's yes.** Only what `create-fumadocs-app`'s TanStack Start template
  installs, minus its OG image (`takumi-js`), devtools and `nitro` packages (see `package.json`); `lucide-react` and `motion` (via fumadocs-ui) may be imported, prefer CSS. If you need a
  package, write it yourself when it is small; otherwise ask the owner, saying what it does, its size and what
  building it would take. No linters, formatters, analytics, OG image generators or AI chat.
- **Public pages** (landing, download, Guide) never name other download managers and claim no price, license,
  "free" or "open source", and no numbers the docs do not state. The site holds user docs only, and names no
  video sites.
- Build-time work goes in `scripts/prebuild/` and writes only git-ignored outputs. Node only, `path` joins.
- LF line endings everywhere (`src/routeTree.gen.ts` is generated and ignored).
- Hero content animates with plain CSS; `<Reveal>` is for content below the fold.

## Known duplication / wishes (for a later cleanup pass)

The three areas were built in parallel, and each made what the foundation did not have:

- **Shared ink class:** the stage that stays dark in both themes exists three times (`.lp-ink`, the download
  hero's `dl-` stage, the docs hero's lane panel). One `.fdm-ink` scope in `global.css` would serve all three.
- **Button shine:** the diagonal hover sweep is `.lp-btn-shine` (landing) and `.dl-cta::after` / `.dl-get::after`
  (download). One modifier on `.fdm-btn-primary` would do.
- **Card shadow token:** the soft layered card shadow (`0 1px 2px rgba(13,27,30,.04), 0 10px 30px -20px …`) is
  repeated in landing, download and docs CSS. A `--fdm-shadow-card` token (light and dark) would replace it.
- **Logo arriving prop:** `landing/chunk-mark.tsx` copies the icon rects of `brand/logo.tsx` to animate the three
  arriving blocks. An `arriving` prop (or a class on that group) on `<Logo>` would remove the copy.
- **Transfer line:** the boot lines (`lp-transfer`, `dl-transfer`) and `RouteProgress` draw the same 2 px line in
  three places.
- **`serve`** (devDependency behind `pnpm start`) could go if the owner prefers `npx serve` or a host's preview.
