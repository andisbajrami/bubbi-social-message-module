# Test Assignment

Short documentation for building, installing this project.

Prerequisites

- Node.js (>= 14) and npm

Install

Install dependencies:

```bash
npm install
```

Build

Development build (provided npm script):

```bash
npm run build
```

What this does:

- Removes `dist` (uses `rimraf`) and runs webpack in development mode.
- Output is written to `./dist/dev` by the current webpack configuration.
