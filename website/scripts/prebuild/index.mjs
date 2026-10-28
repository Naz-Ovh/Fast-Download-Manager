// Build-time work for the website. Runs before `vite dev` and `vite build` (npm "predev" / "prebuild").
// Each step writes only git-ignored outputs. Node only, no shell syntax: works on Windows, Linux and macOS.
import { fonts } from './fonts.mjs';
import { buildInfo } from './version.mjs';

buildInfo();
await fonts();
