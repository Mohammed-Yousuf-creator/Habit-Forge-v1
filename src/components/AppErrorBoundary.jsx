import React from "react";

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Unhandled render error", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="app-fallback-page">
          <section className="app-fallback-card" role="alert">
            <h1>Something went wrong</h1>
            <p>The app hit an unexpected error. Refresh and try again.</p>
            <button className="btn btn--primary" type="button" onClick={this.handleReload}>
              Reload App
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
