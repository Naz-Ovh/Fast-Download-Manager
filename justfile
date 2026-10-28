# Fast Download Manager, public repo: the website and the release notes. Run `just` to list the recipes.
# Needs: Node 22+, pnpm, just. Windows uses PowerShell 7 (pwsh).

set windows-shell := ["pwsh", "-NoLogo", "-NoProfile", "-Command"]

# List the recipes
default:
    @just --list --unsorted

# ── Website ─────────────────────────────────────────────────────────
# The product website (Fumadocs on TanStack Start, prerendered to static files) in website/. See
# website/README.md.

# Install the website's packages with pnpm (first time, or after package.json changes)
[working-directory: 'website']
site-install:
    pnpm install

# Run the website locally at http://localhost:3000
[working-directory: 'website']
site-dev:
    pnpm dev

# Build the static website into website/out
[working-directory: 'website']
site-build:
    pnpm build

# Type check the website
[working-directory: 'website']
site-check:
    pnpm check

# Check the Cloudflare deploy without deploying (run site-build first)
[working-directory: 'website']
site-dry-run:
    pnpm cf:dry-run

# Build and deploy the website to Cloudflare (fdm.naz.ovh); run `pnpm dlx wrangler@4 login` once first
[working-directory: 'website']
site-deploy:
    pnpm cf:deploy
