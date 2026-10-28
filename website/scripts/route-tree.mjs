// Writes src/routeTree.gen.ts (git-ignored) without a build, for `pnpm check`: resolving the Vite config runs
// TanStack's route generator over src/routes. `vite dev` and `vite build` write it on their own.
import { resolveConfig } from 'vite';

await resolveConfig({}, 'build');
console.log('route tree: src/routeTree.gen.ts');
