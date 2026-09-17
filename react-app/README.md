# React conversion

This directory contains the safe Vite/React migration entry point for GreenRoom v3.

The original `index.html` is intentionally preserved at the repository root while the inline application is migrated in stages. This avoids overwriting the working backup with a truncated copy.

## Run locally

```bash
cd react-app
npm install
npm run dev
```

## Migration order

1. Move shared constants and utility functions into `src/utils`.
2. Move `ErrorBoundary` and modal components into `src/components`.
3. Move the main `App` component and state handlers.
4. Verify localStorage compatibility and Gemini/TTS features.
5. Replace the root legacy entry only after a production build and mobile regression test pass.
