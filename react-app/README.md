# React conversion

The complete legacy HTML app is already a React application embedded in an HTML file. A safe conversion must extract the inline JSX without changing its state, localStorage keys, or Gemini/TTS behavior.

The Vite entry point is available in `src/App.jsx`. The legacy root `index.html` is intentionally preserved as the working fallback.

## Important

The GitHub API truncates large file responses. Therefore, do not replace the legacy file from a partial copy. Use the complete backed-up file supplied by the project owner when performing the extraction.

## Local conversion procedure

1. Copy the complete backed-up file into this directory as `mobilev3.html`.
2. Extract the contents of the `<script type="text/babel">` block into `src/App.jsx`.
3. Replace the CDN globals with imports:

```js
import React, { useState, useEffect, useMemo, useRef, Component } from 'react';
import * as Icons from 'lucide-react';
```

4. Replace `ReactDOM.createRoot(document.getElementById('root')).render(...)` with the render call in `main.jsx`.
5. Move the inline CSS into `src/styles.css`.
6. Run `npm install` and `npm run build`.
7. Test localStorage, import/export, Gemini, TTS, Set Builder, and mobile layout before replacing the legacy entry point.

The old application remains available until these checks pass.
