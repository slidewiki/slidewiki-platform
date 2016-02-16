/*globals document*/

import React from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import ApplicationStore from '../stores/ApplicationStore';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import { handleHistory } from 'fluxible-router';
import pages from '../configs/routes';

class Application extends React.Component {
    render() {
        let Handler = this.props.currentRoute.handler;

        return (
            <div className="slidewiki-page">
                <Header currentRoute={this.props.currentRoute} links={pages} />
                <Handler />
                <Footer />
            </div>
        );
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
    [ApplicationStore],
    (context, props) => {
        let appStore = context.getStore(ApplicationStore);
        return {
            pageTitle: appStore.getPageTitle()
        };
    }
)));
