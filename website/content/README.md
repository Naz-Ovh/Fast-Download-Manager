# content

The pages of the website's `/docs` area. This README sits here, one level above `docs/`, because fumadocs-mdx
publishes every `.md` and `.mdx` file inside `content/docs/` as a page.

| path | what | written by |
| --- | --- | --- |
| `docs/meta.json` | top-level order: `index`, `guide` | hand |
| `docs/index.mdx` | docs home (`/docs/`): hero with the chunk motif (`src/components/docs/docs-hero.tsx`), `<EntryCards />`, `<MoreLinks />` | hand |
| `docs/guide/` | sidebar tab **Guide** (`meta.json` `root: true`): the user guide, one `.mdx` per page | hand |

## Guide pages (`docs/guide/`)

| page | route | brief |
| --- | --- | --- |
| `index.mdx` | `/docs/guide/` | Getting started: what the app is, the three-step quick start, where next |
| `install.mdx` | `/docs/guide/install/` | Windows `.msi`, Linux `.run` / `.deb` / Arch package, macOS later |
| `browser-extension.mdx` | `/docs/guide/browser-extension/` | browsers, loading it, popup, capture keys, menus, the video button, languages |
| `downloading.mdx` | `/docs/guide/downloading/` | Add URL, Download File Info, the list, categories, resume, connections, limiter, tray |
| `video.mdx` | `/docs/guide/video/` | detection, direct files, HLS, DASH, merging, what is not supported |
| `cli.mdx` | `/docs/guide/cli/` | `fdm get`, `fdm dash`, `fdm mux` |
| `settings.mdx` | `/docs/guide/settings/` | the settings that exist today, language, theme, where they are stored |
| `troubleshooting.mdx` | `/docs/guide/troubleshooting/` | disconnected extension, logs, refused sites, interrupted downloads, locked exes |
| `faq.mdx` | `/docs/guide/faq/` | short answers |
| `roadmap.mdx` | `/docs/guide/roadmap/` | coming soon, grouped by area, no dates |

## Order

- `meta.json` `pages` sets the sidebar order. `"---Label---"` is a separator, `"..."` adds the remaining pages by
  name. A page not listed (and no `"..."`) is left out of the sidebar but still built.
- `root: true` makes a folder a sidebar tab: the sidebar shows one root folder at a time, with a switcher at its
  top. Inside a root folder `index` is an ordinary first page, not the folder's link.
- The docs home is outside both roots, so on `/docs/` the sidebar shows the whole tree.

## Writing rules for guide pages

- User voice, only what exists today. Anything planned goes in a "Coming soon" `<Callout>` or the roadmap.
- **Never name other download managers** or video sites. No price, license or open-source claims, no invented
  numbers. Allowed numbers: 32 connections (8 by default), 39 app languages, 17 extension languages, 4 browsers.
- American spelling, short sentences, code in fenced blocks with a language. Example URLs only
  `https://cdn.kernel.org/...` tarballs or `https://example.com/...`.
- Components: Fumadocs' `Callout`, `Cards`/`Card`, `Steps`/`Step`, `Tabs`/`Tab`; ours `EntryCards`, `MoreLinks`
  and `<RepoLink path="/issues">text</RepoLink>` (reads `site.repo`). Register new ones in `src/components/mdx.tsx`.
