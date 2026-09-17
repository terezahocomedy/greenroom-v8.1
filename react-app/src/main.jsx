import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
  return (
    <main className="migration-screen">
      <h1>GreenRoom v3 React migration</h1>
      <p>
        The React/Vite entry point is ready. The legacy application remains
        unchanged in the repository root while its inline components are moved
        into this project incrementally.
      </p>
    </main>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
