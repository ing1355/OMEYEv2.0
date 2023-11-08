import React from 'react';

type ErrorBoundaryProps = {
    children: React.ReactNode;
  };
  
  type ErrorBoundaryState = {
    hasError: boolean;
  };

export default class ErrorHandleComponent extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
    state: ErrorBoundaryState = {
        hasError: false
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({
            hasError: true
        })
        console.error(error, errorInfo)
    }
    
    render() {
        return this.props.children
    }
}