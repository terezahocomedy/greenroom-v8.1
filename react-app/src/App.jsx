import React from 'react';
import { createRoot } from 'react-dom/client';
import { AlertCircle } from 'lucide-react';
import './styles.css';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('GreenRoom React error:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="error-screen">
        <AlertCircle size={40} />
        <h1>GreenRoom failed to load</h1>
        <pre>{String(this.state.error)}</pre>
      </main>
    );
  }
}

/**
 * React migration entry point.
 *
 * The legacy application's complete JSX should be placed in this component
 * after running the migration script described in README.md. Keeping the
 * entry point separate allows the old HTML app to remain available while the
 * migration is verified.
 */
function App() {
  return (
    <main className="migration-screen">
      <h1>GreenRoom v3</h1>
      <p>React migration workspace is ready.</p>
      <p className="muted">
        The legacy app is preserved at the repository root until the migrated
        build passes feature and mobile-layout checks.
      </p>
    </main>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
