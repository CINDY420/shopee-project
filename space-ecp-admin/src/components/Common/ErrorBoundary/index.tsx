import { Component } from 'react'

interface IErrorBoundaryProps {
  errorMsg?: string
}
export class ErrorBoundary extends Component<IErrorBoundaryProps> {
  state = {
    error: false,
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    console.error(`Render Error: ${this.props.errorMsg}`, error, errorInfo)
  }

  static getDerivedStateFromError(_error: Error) {
    // Update state so the next render will show the fallback UI.
    return { error: true }
  }

  render() {
    const { error } = this.state

    if (!error) {
      return this.props.children
    }

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h3>Page render error</h3>
        <p className="render-error-tips">
          you can try
          <span
            style={{ color: 'blue', textDecoration: 'underline' }}
            onClick={() => window.location.reload()}
          >
            refresh page
          </span>
        </p>
      </div>
    )
  }
}
