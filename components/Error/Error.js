import React from 'react';
import { NavLink } from 'fluxible-router';
import DeckPageStore from '../../stores/DeckPageStore';

class ErrorComponent extends React.Component {
    render() {
        return (
            <div className="ui negative message padded stackable grid page">
                <i className="close icon"></i>
                <div className="header">
                    {this.props.code} {this.props.message.substr(0, this.props.message.indexOf('.'))}
                </div>
                <p>{this.props.message.substr(this.props.message.indexOf('.') + 1)}</p>
            </div>
        );
    }
}

export default ErrorComponent;
