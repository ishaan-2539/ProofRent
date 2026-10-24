import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 space-y-2">
          <h4 className="font-semibold">{this.props.fallbackTitle || "Something went wrong"}</h4>
          <p className="text-xs">This section could not be rendered.</p>
          {this.props.onRetry && (
            <button
              onClick={() => {
                this.setState({ hasError: false });
                this.props.onRetry?.();
              }}
              className="px-3 py-1 bg-rose-600 text-white text-xs rounded hover:bg-rose-700"
            >
              Retry
            </button>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}