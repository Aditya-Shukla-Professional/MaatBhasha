// ErrorBoundary.jsx — Catches React render errors and displays a user-friendly recovery UI

import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('UI Error Caught by Boundary:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2.5rem 1.5rem',
          maxWidth: '600px',
          margin: '3rem auto',
          background: 'var(--bg-card, #1A120B)',
          border: '1px solid var(--border-color, #3D2B1F)',
          borderRadius: '12px',
          textAlign: 'center',
          color: 'var(--text-primary, #F5EBE1)',
          fontFamily: 'var(--font-devanagari, sans-serif)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌿</div>
          <h2 style={{ color: 'var(--accent-primary, #D49B42)', marginBottom: '0.5rem', fontSize: '1.4rem' }}>
            कुछ तकनीकी समस्या आई (Something went wrong)
          </h2>
          <p style={{ color: 'var(--text-secondary, #C4B0A0)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            एप्लिकेशन को पुनः लोड करें या मुख्य स्क्रीन पर वापस जाएं।
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.handleReload}
              style={{
                padding: '0.65rem 1.5rem',
                background: 'var(--accent-primary, #D49B42)',
                color: '#160F0A',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              🔄 पुनः लोड करें (Reload App)
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
