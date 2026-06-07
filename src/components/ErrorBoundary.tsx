import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  onReset: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('LinkedIn formatter crashed', error, errorInfo);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="app-shell error-shell">
        <section className="workspace-panel error-panel" role="alert">
          <p className="eyebrow">Recovery</p>
          <h1>The editor hit a problem.</h1>
          <p>Your browser may have stored an invalid draft. Resetting will restore the sample draft and let you continue.</p>
          <button
            type="button"
            className="primary-action"
            onClick={() => {
              this.props.onReset();
              this.setState({ hasError: false });
            }}
          >
            Reset editor
          </button>
        </section>
      </main>
    );
  }
}