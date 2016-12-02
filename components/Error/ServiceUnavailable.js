import React from 'react';
import ServiceErrorStore from '../../stores/ServiceErrorStore';

class ServiceUnavailable extends React.Component {
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
                    {/*
                    <li><b>Additional information:</b> {this.props.error.additionalInfo}</li>
                    */}
                </ul>
            </div>
        );
    }
}

ServiceUnavailable.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
ServiceUnavailable = connectToStores(ServiceUnavailable, [ServiceErrorStore], (context, props) => {
    return {
        ServiceErrorStore: context.getStore(ServiceErrorStore).getState()
    };
});

export default ServiceUnavailable;
