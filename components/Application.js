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
import ServiceErrorStore from '../stores/ServiceErrorStore';
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
        else if (this.props.ServiceErrorStore.error) {
            const error = this.props.ServiceErrorStore.error;
            return (
                <div className="slidewiki-page">
                    <Header currentRoute={this.props.currentRoute} links={pages} />
                    {error.hasOwnProperty('statusCode') ? <div className="ui error message container text left">
                                                            <div className="row">
                                                                <b>{error.statusCode} {error.statusText}</b>
                                                            </div>
                                                            <ul className="list">
                                                                <li><b>Description&#58;</b> {error.description} {error.actionRequired}</li>
                                                                <li><b>Navigation&#58;</b> {error.navStack}</li>
                                                            </ul>
                                                        </div>: ''
                    }
                <Handler />
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

export default provideContext(handleHistory(connectToStores(
    DragDropContext(HTML5Backend)(Application),
    [ApplicationStore, ErrorStore, ServiceErrorStore],
    (context, props) => {
        let appStore = context.getStore(ApplicationStore);
        return {
            pageTitle: appStore.getPageTitle(),
            ErrorStore: context.getStore(ErrorStore).getState(),
            ServiceErrorStore: context.getStore(ServiceErrorStore).getState(),
        };
    }
)));
