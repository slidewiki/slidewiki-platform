/*global document, window */
import React from 'react';
import ReactDOM from 'react-dom';
import debug from 'debug';
import app from './app';
import { IntlProvider } from 'react-intl';
import { loadLocale } from './configs/locales';
import es6Promise from 'es6-promise';
es6Promise.polyfill();
import '@babel/polyfill';

const debugClient = debug('slidewiki-platform');
const dehydratedState = window.App; // Sent from the server

window.React = ReactDOM; // For chrome dev tool support

// expose debug object to browser, so that it can be enabled/disabled from browser:
// https://github.com/visionmedia/debug#browser-support
window.fluxibleDebug = debug;

//removing hash, for redirects
function removeHash () {
    let scrollV, scrollH, loc = window.location;
    if ('replaceState' in history)
        history.replaceState('', document.title, loc.pathname + loc.search);
    else {
        // Prevent scrolling by storing the page's current scroll offset
        scrollV = document.body.scrollTop;
        scrollH = document.body.scrollLeft;

        loc.hash = '';

        // Restore the scroll offset, should be flicker free
        document.body.scrollTop = scrollV;
        document.body.scrollLeft = scrollH;
    }
}

function renderApp(locale, messages) {
    debugClient('rehydrating app');
    // pass in the dehydrated server state from server.js
    app.rehydrate(dehydratedState, (err, context) => {
        if (err) {
            throw err;
        }
        window.context = context;
        removeHash();
        const mountNode = document.getElementById('app');

        const Root = app.getComponent();
        ReactDOM.render(
            <IntlProvider locale={locale} messages={messages}>
                <Root context={ context.getComponentContext() } />
            </IntlProvider>,
            mountNode,
            () => {
                debug('Root component has been mounted');
            }
        );
    });
}

// Load the Intl polyfill and required locale data
const locale = document.documentElement.getAttribute('lang');

loadLocale(locale).then((messages) => {
    renderApp(locale, messages);
}).catch((err) => {
    console.error(err);
});
