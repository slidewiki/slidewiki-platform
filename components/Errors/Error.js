import React from 'react';
import { NavLink } from 'fluxible-router';
import DeckPageStore from '../../stores/DeckPageStore';

class ErrorComponent extends React.Component {
    render() {
        return (
            <div className="ui negative message padded stackable grid page">
                <i className="close icon"></i>
                <div className="header">
                    {this.props.errorMsg}
                </div>
                <p>The request could not be understood by the server.
                Please do not repeat the request without modifications.
                Contact the server’s administrator if this problem persists.</p>
            </div>
        );
    }
}

export default ErrorComponent;
