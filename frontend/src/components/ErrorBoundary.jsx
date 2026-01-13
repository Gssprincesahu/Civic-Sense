import React, { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center text-red-500 p-4">
          Oops! Something went wrong while loading the map.
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;