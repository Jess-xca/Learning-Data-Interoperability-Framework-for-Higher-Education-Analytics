import React from "react";
import { Card } from "../index";

interface Props {
  children: React.ReactNode;
  fallback?: (error: Error) => React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error);
      }

      return (
        <div className="p-8 max-w-2xl mx-auto mt-10">
          <Card className="p-8 border-l-4 border-error">
            <div className="flex gap-4 mb-4">
              <span className="material-symbols-outlined text-3xl text-error">
                error
              </span>
              <div>
                <h1 className="text-2xl font-bold text-error mb-2">
                  Something went wrong
                </h1>
                <p className="text-on-surface-variant">
                  {this.state.error.message ||
                    "An unexpected error occurred"}
                </p>
              </div>
            </div>
            <details className="mt-4 text-sm text-on-surface-variant">
              <summary className="cursor-pointer font-semibold">
                Error details
              </summary>
              <pre className="mt-2 p-3 bg-surface-container-low rounded text-xs overflow-auto">
                {this.state.error.stack}
              </pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-4 py-2 bg-error text-on-error rounded-lg font-semibold hover:opacity-90"
            >
              Try again
            </button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
