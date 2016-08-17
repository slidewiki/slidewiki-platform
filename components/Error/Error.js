import React from 'react';
import { NavLink } from 'fluxible-router';
import { connectToStores } from 'fluxible-addons-react';
import ErrorStore from '../../stores/ErrorStore';
import BadRequest from '../../components/Error/BadRequest';
import BadGateway from '../../components/Error/BadGateway';
import Forbidden from '../../components/Error/Forbidden';
import GatewayTimeout from '../../components/Error/GatewayTimeout';
import InternalServerError from '../../components/Error/InternalServerError';
import MethodNotAllowed from '../../components/Error/MethodNotAllowed';
import NotFound from '../../components/Error/NotFound';
import NotImplemented from '../../components/Error/NotImplemented';
import PayloadTooLarge from '../../components/Error/PayloadTooLarge';
import RequestHeaderTooLarge from '../../components/Error/RequestHeaderTooLarge';
import ServiceUnavailable from '../../components/Error/ServiceUnavailable';
import TooManyRequests from '../../components/Error/TooManyRequests';
import Unauthorized from '../../components/Error/Unauthorized';
import URITooLong from '../../components/Error/URITooLong';
import UnprocessableEntity from '../../components/Error/UnprocessableEntity';

/**
* Creates a generic error component that calls error specific component
* depending upon HTTP status code in the error message.
*/
class Error extends React.Component {
    render() {
        switch(this.props.error.statusCode) {
            case 400:
                return (
                    <BadRequest error={this.props.error} />
                );
                break;
            case 401:
                return (
                    <Unauthorized error={this.props.error} />
                );
                break;
            case 403:
                return (
                    <Forbidden error={this.props.error} />
                );
                break;
            case 404:
                return (
                    <NotFound error={this.props.error} />
                );
                break;
            case 405:
                return (
                    // GET should always be allowed. It is only for POST/PUT/DELETE
                    <MethodNotAllowed error={this.props.error} />
                );
                break;
            case 413:
                return (
                    // For POST and PUT request
                    <PayloadTooLarge error={this.props.error} />
                );
                break;
            case 414:
                return (
                    // For GET request
                    <URITooLong error={this.props.error} />
                );
                break;
            case 422:
                return (
                    <UnprocessableEntity error={this.props.error} />
                );
                break;
            case 429:
                return (
                    // For rate limiting
                    <TooManyRequests error={this.props.error} />
                );
                break;
            case 431:
                return (
                    <RequestHeaderTooLarge error={this.props.error} />
                );
                break;
            case 500:
                return (
                    <InternalServerError error={this.props.error} />
                );
                break;
            case 501:
                return (
                    <NotImplemented error={this.props.error} />
                );
                break;
            case 502:
                return (
                    <BadGateway error={this.props.error} />
                );
                break;
            case 503:
                return (
                    <ServiceUnavailable error={this.props.error} />
                );
                break;
            case 504:
                return (
                    <GatewayTimeout error={this.props.error} />
                );
                break;
            default:
                return (
                    <InternalServerError error={this.props.error} />
                );
        }
    }
}

Error.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
Error = connectToStores(Error, [ErrorStore], (context, props) => {
    return {
        ErrorStore: context.getStore(ErrorStore).getState()
    };
});
export default Error;
