import PropTypes from 'prop-types';
import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import ErrorStore from '../../stores/ErrorStore';

class Error extends React.Component {
    handleReload(){
        window.location.reload();
    }

    render() {
        switch(this.props.error.statusCode) {
            case 503:
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
                break;
            default:
                return (
                  <div className="ui error message text container left">
                      <div className="header row">
                          {this.props.error.statusCode} {this.props.error.statusText}
                      </div>
                      <ul className="list">
                          <li><b>Type:</b> {this.props.error.type}</li>
                          <li><b>Description:</b> {this.props.error.description}</li>
                          <li><b>Action required:</b> {this.props.error.actionRequired}{(this.props.error.statusCode === 504 || this.props.error.statusCode === 429) ? <a className="user" href="javascript:void(0)" onClick={this.handleReload.bind(this)} >Reload now</a> : ''}</li>
                      </ul>
                  </div>
                );
        }
    }
}

Error.contextTypes = {
    executeAction: PropTypes.func.isRequired
};
Error = connectToStores(Error, [ErrorStore], (context, props) => {
    return {
        ErrorStore: context.getStore(ErrorStore).getState()
    };
});
export default Error;
