# GreenRoom v3 — React Edition

## Overview

GreenRoom is a mobile-first stand-up comedy set builder with:

- **Bit Library** — Write, tag, and organize comedy bits
- **Punchline Highlighter** — Mark key jokes for emphasis
- **Set Builder** — Arrange bits into sets with time tracking
- **AI Studio** — Powered by Google Gemini (optional API key)
- **Personas** — Create custom AI reviewers (Consultant, Roast Master, etc.)
- **Import/Export** — Backup and restore your bits as JSON
- **Mobile-First** — Optimized layout collapses on small screens

## Quick Start

```bash
cd react-app
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Building for Production

```bash
npm run build
```

Output is in `dist/`.

## Configuration

### Gemini API (Optional)

To enable AI features:
1. Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Enter it in the Settings panel
3. Use AI Studio to analyze and improve bits

## Data

All data is stored locally in browser localStorage under `greenroom_v3_data`.

Export your library regularly to `json` for backups.

## Migration

This React/Vite version preserves 100% of the original HTML app's features while moving to a modern component architecture. The legacy HTML is kept as `../index.html` for reference.

## Technology Stack

- **React 18** — UI components and state management
- **Vite 5** — Fast dev server and production bundler
- **Lucide React** — Icon library
- **Tailwind CSS** — Responsive utility styles (via CDN in legacy builds)
- **Google Gemini API** — Optional AI analysis

## License

MIT © 2024–2026 terezahocomedy
