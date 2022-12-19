import { Component, ErrorInfo } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false};
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("ErrorBoundary caught an error", error, info);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <h2>
          Detector malfunctioning. Try again later.
        </h2>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
