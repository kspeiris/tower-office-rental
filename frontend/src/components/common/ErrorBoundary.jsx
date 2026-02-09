import React from 'react';
import { HiExclamationTriangle } from 'react-icons/hi';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-black/40 p-10 text-center border border-gray-100 dark:border-gray-800">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 mb-6 scale-110">
              <HiExclamationTriangle className="h-10 w-10" />
            </div>

            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Something went wrong</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 font-medium">
              We apologize for the inconvenience. Please try refreshing the page or contact support if the problem persists.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-8 text-left">
                <details className="text-sm group">
                  <summary className="cursor-pointer text-red-600 dark:text-red-400 mb-3 font-bold flex items-center gap-2 select-none">
                    <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
                    Error Details
                  </summary>
                  <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-xl font-mono text-xs overflow-auto border border-gray-200 dark:border-gray-800 max-h-40">
                    {this.state.error.toString()}
                    <br />
                    {this.state.errorInfo?.componentStack}
                  </div>
                </details>
              </div>
            )}

            <div className="flex flex-col gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20"
              >
                Refresh Page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-8 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              >
                Go to Homepage
              </button>
            </div>

            <p className="mt-8 text-sm text-gray-500 dark:text-gray-500 font-medium bg-gray-50 dark:bg-gray-950/50 py-3 rounded-lg">
              Need help? <a href="mailto:support@towerspace.com" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">support@towerspace.com</a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;