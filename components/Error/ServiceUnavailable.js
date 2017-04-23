import React from 'react';

class ServiceUnavailable extends React.Component {
    render() {
        return (
            <div className="ui error message container text left">
                <div className="row">
                    <b>{this.props.error.statusCode} {this.props.error.statusText}</b>
                </div>
                <ul className="list">
                    <li><b>Description&#58;</b> {this.props.error.description} {this.props.error.actionRequired}</li>
                    <li><b>Navigation&#58;</b> {this.props.error.navStack}</li>
                </ul>
            </div>
        );
    }
}

export default ServiceUnavailable;
