import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

export default function ErrorBoundary({ children }) {
  const [error, setError] = useState(null);

  if (error) {
    return (
      <main className="error-screen">
        <AlertCircle size={40} />
        <h1>GreenRoom failed to load</h1>
        <pre>{String(error)}</pre>
      </main>
    );
  }

  return <ErrorBoundaryCatcher onError={setError}>{children}</ErrorBoundaryCatcher>;
}

class ErrorBoundaryCatcher extends React.Component {
  static getDerivedStateFromError(error) { return { error }; }
  state = { error: null };
  componentDidCatch(error, info) {
    console.error('GreenRoom React error:', error, info);
    this.props.onError(error);
  }
  render() { return this.state.error ? null : this.props.children; }
}
