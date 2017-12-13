import React from 'react';

class ServiceUnavailable extends React.Component {

    handleReload(){
        window.location.reload();
    }
    render() {
        return (
            <div className="ui error message container text left">
                <div className="row">
                    <b>{this.props.error.statusCode} {this.props.error.statusText}</b>
                </div>
                <ul className="list">
                    <li><b>Description&#58;</b> {this.props.error.description} {this.props.error.actionRequired}<a className="user" href="javascript:void(0)" onClick={this.handleReload.bind(this)} >Reload now</a></li>
                    <li><b>Navigation&#58;</b> {this.props.error.navStack}</li>
                </ul>
            </div>
        );
    }
}

export default ServiceUnavailable;
