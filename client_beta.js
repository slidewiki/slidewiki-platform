/*global document, window */

import ReactDOM from 'react-dom';
import debug from 'debug';
import { createElementWithContext } from 'fluxible-addons-react';
import app from './app';
import { IntlProvider } from 'react-intl';
import es6Promise from 'es6-promise';
es6Promise.polyfill();

const debugClient = debug('slidewiki-platform');
const dehydratedState = window.App; // Sent from the server

window.React = ReactDOM; // For chrome dev tool support

// expose debug object to browser, so that it can be enabled/disabled from browser:
// https://github.com/visionmedia/debug#browser-support
window.fluxibleDebug = debug;


// Contains utils to download the locale data for the current language, eventually
// requiring the `Intl` polyfill for browser not supporting it
// It is used in client.js *before* rendering the root component.

import { addLocaleData } from 'react-intl';
import isIntlLocaleSupported from 'intl-locales-supported';



// Returns a promise which is resolved when Intl has been polyfilled

function loadIntlPolyfill(locale) {

    if (window.Intl && isIntlLocaleSupported(locale)) {
        // all fine: Intl is in the global scope and the locale data is available
        return Promise.resolve();
    }

    return new Promise((resolve) => {
        debug('Intl or locale data for %s not available, downloading the polyfill...', locale);

        // When building: create a intl chunk with webpack
        // When executing: run the callback once the chunk has been download.
        require.ensure(['intl'], (require) => {
            require('intl'); // apply the polyfill
            debug('Intl polyfill for %s has been loaded', locale);
            resolve();
        }, 'intl');

    });

};

// Returns a promise which is resolved as the required locale-data chunks
// has been downloaded with webpack's require.ensure. For each language,
// we make two different chunks: one for browsers supporting `intl` and one
// for those who don't.
// The react-intl locale-data is required, for example, by the FormattedRelative
// component.
function loadLocaleData(locale) {
    const hasIntl = isIntlLocaleSupported(locale);

    // Make sure ReactIntl is in the global scope: this is required for adding locale-data
    // Since ReactIntl needs the `Intl` polyfill to be required (sic) we must place
    // this require here, when loadIntlPolyfill is supposed to be present
    //require('expose?ReactIntl!react-intl');

    return new Promise( (resolve) => {

        switch (locale) {

            // english
            case 'en':

                if (!hasIntl) {

                    require.ensure([
                        'intl/locale-data/jsonp/en',
                        'react-intl/locale-data/en'
                    ], (require) => {
                        require('intl/locale-data/jsonp/en');
                        addLocaleData(require('react-intl/locale-data/en'));
                        debug('Intl and ReactIntl locale-data for %s has been downloaded', locale);
                        resolve();
                    }, 'locale-en');
                }
                else {
                    require.ensure([
                        'react-intl/locale-data/en'
                    ], (require) => {
                        addLocaleData(require('react-intl/locale-data/en'));
                        debug('ReactIntl locale-data for %s has been downloaded', locale);
                        resolve();
                    }, 'locale-en-no-intl');
                }
                break;


            // english
            case 'ru':

                if (!hasIntl) {

                    require.ensure([
                        'intl/locale-data/jsonp/ru',
                        'react-intl/locale-data/ru'
                    ], (require) => {
                        require('intl/locale-data/jsonp/ru');
                        addLocaleData(require('react-intl/locale-data/ru'));
                        debug('Intl and ReactIntl locale-data for %s has been downloaded', locale);
                        resolve();
                    }, 'locale-ru');
                }
                else {
                    require.ensure([
                        'react-intl/locale-data/ru'
                    ], (require) => {
                        addLocaleData(require('react-intl/locale-data/ru'));
                        debug('ReactIntl locale-data for %s has been downloaded', locale);
                        resolve();
                    }, 'locale-ru-no-intl');
                }
                break;



        }

    });

};





function renderApp(locale) {
    debugClient('rehydrating app');
    // pass in the dehydrated server state from server.js
    app.rehydrate(dehydratedState, (err, context) => {
        if (err) {
            throw err;
        }
        window.context = context;
        const mountNode = document.getElementById('app');

        const Root = app.getComponent();

        ReactDOM.render(
            <IntlProvider locale={ locale }>
            <Root context={ context.getComponentContext() } />
            </IntlProvider>
            , mountNode, () => {
                debug('Root component has been mounted');
            });

            // debugClient('React Rendering');
            // ReactDOM.render(
            //     createElementWithContext(context),
            //     mountNode,
            //     () => debugClient('React Rendered')
            // );
    });
}



    // Load the Intl polyfill and required locale data
const locale = document.documentElement.getAttribute('lang');

loadIntlPolyfill(locale)
.then(loadLocaleData.bind(null, locale))
.then(renderApp.bind(null, locale))
.catch( (err) => {
    console.error(err);
});
