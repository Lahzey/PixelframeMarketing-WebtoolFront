import React from "react";

export default class ErrorBoundary extends React.Component {
    state = { hasError: false }
    
    static getDerivedStateFromError(error) {
        return { hasError: true }
    }
    
    componentDidCatch(error, errorInfo) {
        console.log(error,  errorInfo);
    }
    
    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        } else {
            return this.props.children;
        }
    }
}