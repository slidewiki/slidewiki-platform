/*globals document*/

import React from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import ApplicationStore from '../stores/ApplicationStore';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import { handleHistory } from 'fluxible-router';
import pages from '../configs/routes';
import ErrorStore from '../stores/ErrorStore';
import ErrorComponent from './Error/Error';

class Application extends React.Component {
    render() {
        let Handler = this.props.currentRoute.handler;
        if (this.props.ErrorStore.error) {
            return (
                <div className="slidewiki-page">
                    <Header currentRoute={this.props.currentRoute} links={pages} />
                    <ErrorComponent error={this.props.ErrorStore.error} />
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
    Application,
    [ApplicationStore, ErrorStore],
    (context, props) => {
        let appStore = context.getStore(ApplicationStore);
        return {
            pageTitle: appStore.getPageTitle(),
            ErrorStore: context.getStore(ErrorStore).getState()
        };
    }
)));
