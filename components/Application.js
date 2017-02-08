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
import { IntlProvider } from 'react-intl';
import Cookie from 'js-cookie';

// app.js
import {addLocaleData} from 'react-intl';
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';
import es from 'react-intl/locale-data/es';
import ru from 'react-intl/locale-data/ru';
import de from 'react-intl/locale-data/de';

addLocaleData([...en, ...fr, ...es, ...ru, ...de]);

const locale = Cookie.get('locale') || 'en';
const messages = require(`../intl/${locale}`).messages;

class Application extends React.Component {
    render() {
        let Handler = this.props.currentRoute.handler;
        if (this.props.ErrorStore.error) {
            return (
                <IntlProvider locale={locale} messages = {messages}>
                    <div className="slidewiki-page">
                        <Header currentRoute={this.props.currentRoute} links={pages} />
                        <Error error={this.props.ErrorStore.error} />
                        <Footer />
                    </div>
                </IntlProvider>
            );
        }
        else {
            return (
                <IntlProvider locale={locale} messages = {messages}>
                    <div className="slidewiki-page">
                        <Header currentRoute={this.props.currentRoute} links={pages} />
                        <Handler />
                        <Footer />
                    </div>
                </IntlProvider>
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
    [ApplicationStore, ErrorStore],
    (context, props) => {
        let appStore = context.getStore(ApplicationStore);
        return {
            pageTitle: appStore.getPageTitle(),
            ErrorStore: context.getStore(ErrorStore).getState()
        };
    }
)));
