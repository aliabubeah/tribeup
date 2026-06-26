import { Component } from "react";

export default class AvatarErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            // Render the fallback child (default avatar) instead of crashing
            return this.props.fallback;
        }
        return this.props.children;
    }
}