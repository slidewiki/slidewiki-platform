// this file includes the UI locales supported
// and some code supporting loading intl libraries and assets
import isIntlLocaleSupported from 'intl-locales-supported';

// Returns a promise which is resolved when Intl has been polyfilled
function loadIntlPolyfill(locale) {

    if (window.Intl && isIntlLocaleSupported(locale)) {
        // all fine: Intl is in the global scope and the locale data is available
        return Promise.resolve();
    }

    debug('Intl or locale data for %s not available, downloading the polyfill...', locale);

    // using import instead of require.ensure (webpack 1 way)
    return import('intl').then((intl) => {
        // When building: create a intl chunk with webpack
        // When executing: run the callback once the chunk has been download.
        debug('Intl polyfill for %s has been loaded', locale);
    });

};

function loadLocaleData(locale) {
    return new Promise((resolve) => {
        localeLoaders[locale]()(resolve);
    });
}

// this is the definitive list of supported ui locales
const localeLoaders = {
    en: () => require('react-intl-loader?locale=en!../intl/en.json'),
    de: () => require('react-intl-loader?locale=de!../intl/de.json'),
    it: () => require('react-intl-loader?locale=it!../intl/it.json'),
    es: () => require('react-intl-loader?locale=es!../intl/es.json'),
    nl: () => require('react-intl-loader?locale=nl!../intl/nl.json'),
    el: () => require('react-intl-loader?locale=el!../intl/el.json'),
    ca: () => require('react-intl-loader?locale=ca!../intl/ca.json'),
    sr: () => require('react-intl-loader?locale=sr!../intl/sr.json'),
};

export default {
    locales: Object.keys(localeLoaders),

    loadLocale: function(locale) {
        return loadIntlPolyfill(locale).then(() => {
            return loadLocaleData(locale);
        });
    },
};
