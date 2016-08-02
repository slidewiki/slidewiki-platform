import React from 'react';
import classNames from 'classnames/bind';
import {connectToStores} from 'fluxible-addons-react';
import ErrorStore from '../../stores/ErrorStore';
import NotFound from '../../components/Error/NotFound';

class RouteNotFound extends React.Component {
    render() {
        return (
            <div ref='routenotefound'>
                <NotFound error={this.props.ErrorStore.error} />
            </div>
        );
    }
}

RouteNotFound.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
RouteNotFound = connectToStores(RouteNotFound, [ErrorStore], (context, props) => {
    return {
        ErrorStore: context.getStore(ErrorStore).getState()
    };
});
export default RouteNotFound;
