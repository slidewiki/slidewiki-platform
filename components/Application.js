/*globals document*/

import PropTypes from 'prop-types';

import React from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import ApplicationStore from '../stores/ApplicationStore';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import { handleHistory } from 'fluxible-router';
import ErrorStore from '../stores/ErrorStore';
import Error from './Error/Error';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import cleanStore from '../actions/error/cleanStore';
import CookieBanner from 'react-cookie-banner';
import BannerContent from 'react-cookie-banner';
import cookie from 'react-cookie';
import {FormattedMessage, defineMessages} from 'react-intl';
import {navigateAction} from 'fluxible-router';


class Application extends React.Component {

    constructor(props) {
        super(props);
        this.state =  {user_cookies: cookie.load('user-has-accepted-cookies')};
    }

    componentDidMount() {
        const activationMessages = defineMessages({
            swal_title:{
                id: 'activationMessages.swalTitle',
                defaultMessage: 'Account activated',
            },
            swal_text:{
                id: 'activationMessages.swalText',
                defaultMessage: 'Your account has been successfully activated. You are now able to login'
            },
            swal_confirm:{
                id: 'activationMessages.swalConfirm',
                defaultMessage: 'Close',
            }
        });

        if (this.props.showActivationMessage) {
            swal({
                title: this.context.intl.formatMessage(activationMessages.swal_title),
                text: this.context.intl.formatMessage(activationMessages.swal_text),
                type: 'success',
                confirmButtonText: this.context.intl.formatMessage(activationMessages.swal_confirm),
                confirmButtonClass: 'positive ui button',
                allowEscapeKey: false,
                allowOutsideClick: false,
                buttonsStyling: false
            }).then(() => {
                this.context.executeAction(navigateAction, {//go to home page after showing activation message
                    url: '/'
                });
                return true;
            });
        }
    }

    render() {
        let cookieBanner = '';
        let Handler = this.props.currentRoute.handler;
        let header = null , footer = null, content = null;
        const noHF_pages = ['presentation', 'neo4jguide', 'webrtc', 'print', 'presentationIE'];//NOTE add the route name to the following array if you don't want header and footer rendered on the page
        if(!noHF_pages.includes(this.props.currentRoute.name)){
            header = <Header />; footer = <Footer />;
            //does not show banner on the above pages
            if (!this.state.user_cookies) {
                cookieBanner = <FormattedMessage id="header.cookieBanner" defaultMessage='This website uses cookies.'>
                    {(message) =>
                      <CookieBanner message={message} cookie='user-has-accepted-cookies' dismissOnScroll={false} onAccept={() => {}}/>}
                    </FormattedMessage>;
            }
        }
        content = (this.props.ErrorStore.error) ? <Error error={this.props.ErrorStore.error} /> : <Handler />;

        return (
              <div className="slidewiki-page">
                  {cookieBanner}
                  {header}
                  <div style={{paddingTop: 80}}>
                  {content}
                  </div>
                  {footer}
              </div>
        );
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.props.ErrorStore.error && !nextProps.ErrorStore.error)
            return false;
        return true;
    }

    componentDidUpdate(prevProps, prevState) {

        const newProps = this.props;
        if (newProps.pageTitle === prevProps.pageTitle) {
            return;
        }
        document.title = newProps.pageTitle;
        if(this.props.ErrorStore.error)
            context.executeAction(cleanStore);
    }
}
Application.contextTypes = {
    getStore: PropTypes.func,
    executeAction: PropTypes.func,
    getUser: PropTypes.func,
    intl: PropTypes.object.isRequired
};

Application = provideContext(Application, { //jshint ignore:line
    getUser: PropTypes.func
});

export default provideContext(handleHistory(connectToStores(
    DragDropContext(HTML5Backend)(Application),
    [ApplicationStore, ErrorStore],
    (context, props) => {
        let appStore = context.getStore(ApplicationStore);
        return {
            pageTitle: appStore.getPageTitle(),
            showActivationMessage: appStore.getActivationMessage(),
            ErrorStore: context.getStore(ErrorStore).getState(),
        };
    }
)));
