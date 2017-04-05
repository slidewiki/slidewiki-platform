import React from 'react';

class BadRequest extends React.Component {
    render() {
        return (
            <div className="ui error message text container left">
                <div className="header row">
                    {this.props.error.statusCode} {this.props.error.statusText}
                </div>
                <ul className="list">
                    <li><b>Type:</b> {this.props.error.type}</li>
                    <li><b>Description:</b> {this.props.error.description}</li>
                    <li><b>Action required:</b> {this.props.error.actionRequired}</li>
                </ul>
            </div>
        );
    }
}

export default BadRequest;
