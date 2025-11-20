# Attachment Tray Extension

A basic Chrome Extension built with TypeScript and Vite.

## Prerequisites

- Node.js (v14 or higher)
- npm

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Development

To run the build in watch mode (rebuilds on file changes):

```bash
npm run dev
```

## Building

To create a production build:

```bash
npm run build
```

The build output will be in the `dist` directory.

## Loading in Chrome

1. Open Chrome and navigate to `chrome://extensions`
2. Enable **Developer mode** in the top right corner
3. Click **Load unpacked**
4. Select the `dist` directory from this project