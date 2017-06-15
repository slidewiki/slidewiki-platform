/*globals document*/

import React from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import ApplicationStore from '../stores/ApplicationStore';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import { handleHistory } from 'fluxible-router';
import pages from '../configs/routes';
import ErrorStore from '../stores/ErrorStore';
import Error from './Error/Error';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';


class Application extends React.Component {
    render() {
        let Handler = this.props.currentRoute.handler;
        if (this.props.ErrorStore.error) {
            return (

                    <div className="slidewiki-page">
                        <Header currentRoute={this.props.currentRoute} links={pages} />
                        <Error error={this.props.ErrorStore.error} />
                        <Footer />
                    </div>

            );
        }
        else {
            return (

                    <div className="slidewiki-page">
                        <Header currentRoute={this.props.currentRoute} links={pages} />
                        <Handler />
                        <Footer />
                    </div>

            );
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const newProps = this.props;
        if (newProps.pageTitle === prevProps.pageTitle) {
            return;
        }
        document.title = newProps.pageTitle;
    }
}
Application.contextTypes = {
    getStore: React.PropTypes.func,
    executeAction: React.PropTypes.func,
    getUser: React.PropTypes.func
};

Application = provideContext(Application, { //jshint ignore:line
    getUser: React.PropTypes.func
});

export default provideContext(handleHistory(connectToStores(
    DragDropContext(HTML5Backend)(Application),
    [ApplicationStore, ErrorStore],
    (context, props) => {
        let appStore = context.getStore(ApplicationStore);
        return {
            pageTitle: appStore.getPageTitle(),
            ErrorStore: context.getStore(ErrorStore).getState(),
        };
    }
)));
