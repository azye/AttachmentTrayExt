# Project Context for Agents

## Overview
This is a Chrome Extension project named "Attachment Tray Extension". It is built using:
- **Vite**: For bundling and development.
- **TypeScript**: For type-safe logic.
- **Manifest V3**: The latest Chrome Extension manifest version.

## Structure
- `src/`: Contains the source code (TypeScript, etc.).
- `public/`: Contains static assets like `manifest.json` and icons.
- `dist/`: The output directory for the build. This is what gets loaded into Chrome.
- `vite.config.ts`: Vite configuration.

## Key Commands
- `npm run build`: Compiles the project to `dist/`. **Always run this after making changes to ensure the extension is up-to-date.**
- `npm run dev`: Runs Vite in watch mode (useful for development).

## Notes
- When adding new assets (images, etc.), place them in `public/`.
- The `manifest.json` is located in `public/manifest.json`.
- Ensure `dist/` is used when loading the unpacked extension in Chrome.
