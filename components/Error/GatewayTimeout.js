import React from 'react';

class GatewayTimeout extends React.Component {
    handleReload(){
        window.location.reload();
    }
    render() {
        return (
            <div className="ui error message text container left">
                <div className="header row">
                    {this.props.error.statusCode} {this.props.error.statusText}
                </div>
                <ul className="list">
                    <li><b>Type:</b> {this.props.error.type}</li>
                    <li><b>Description:</b> {this.props.error.description}</li>
                    <li><b>Action required:</b> {this.props.error.actionRequired} <a className="user" href="javascript:void(0)" onClick={this.handleReload.bind(this)} >Reload now</a></li>
                </ul>
            </div>
        );
    }
}

export default GatewayTimeout;
