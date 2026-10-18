# Shri Sawariya Seth Interior Designs — local Vite migration

## What this ZIP contains
- The 245 project files exported from the Floot MCP virtual file tree, preserved under their original paths.
- Reconstructed local entry/configuration files: `package.json`, `index.html`, `main.tsx`, `vite.config.ts`, and `tsconfig.json`.
- Image references are pointed at the original Floot-hosted static asset URLs so the site imagery does not incorrectly request `localhost/_cdn/...`.

## Run locally
1. Install Node.js 20 LTS or newer.
2. Extract this ZIP.
3. In the extracted folder, run:
   ```bash
   npm install
   npm run dev
   ```
4. Open the local URL Vite prints (normally `http://localhost:5173`).

For a production frontend bundle, run `npm run build` and then `npm run preview`.

## Important limitations — read before relying on this
This is a **migration attempt, not a verified byte-for-byte standalone clone of Floot hosting**.
- Floot's virtual file export did not contain `package.json`, `index.html`, `main.tsx`, or Vite/TypeScript configuration. Those files in this ZIP are reconstructed, not original Floot exports.
- The original app's server endpoint handlers and DB helper are included as source, but they require Floot's runtime, its `FLOOT_DATABASE_URL`, and auth/session infrastructure. Those secrets/database records are not included in this ZIP.
- Vite proxies `/_api` requests to the original Floot app to preserve access to its existing API while that hosted app remains available. Whether authenticated admin flows work through this proxy depends on Floot's cookie/session and deployment behavior; it has not been verified. This is not a standalone backend migration.
- Static images are still served by the original Floot host. Keep that app/assets available or download the separate static-images archive and configure local assets before taking the site offline.
- I could not complete `npm install` or a production build in this environment (dependency installation timed out), so the build is **not yet verified**. Do not treat it as guaranteed production-ready until `npm install` and `npm run build` succeed on your machine and every route/API flow is tested.

## Original project files vs reconstructed files
The original exported files are unchanged except that references to `/_cdn/static/...` in text/code were made absolute to the existing Floot asset host so those assets can load from localhost. The following files were added/reconstructed for Vite:
- `package.json`
- `index.html`
- `main.tsx`
- `vite.config.ts`
- `tsconfig.json`

No Floot database content, secrets, or environment variables are bundled.
