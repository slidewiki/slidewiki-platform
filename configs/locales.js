// this file includes the UI locales supported
// and some code supporting loading intl libraries and assets
import debug from 'debug';
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

// this is the list of supported ui locales
// it should include all the files under /intl/*.json
const localeLoaders = {
    ca: () => require('react-intl-loader?locale=ca!../intl/ca.json'),
    cy: () => require('react-intl-loader?locale=cy!../intl/cy.json'),
    de: () => require('react-intl-loader?locale=de!../intl/de.json'),
    el: () => require('react-intl-loader?locale=el!../intl/el.json'),
    en: () => require('react-intl-loader?locale=en!../intl/en.json'),
    es: () => require('react-intl-loader?locale=es!../intl/es.json'),
    fr: () => require('react-intl-loader?locale=fr!../intl/fr.json'),
    fy: () => require('react-intl-loader?locale=fy!../intl/fy.json'),
    gd: () => require('react-intl-loader?locale=gd!../intl/gd.json'),
    it: () => require('react-intl-loader?locale=it!../intl/it.json'),
    nl: () => require('react-intl-loader?locale=nl!../intl/nl.json'),
    ru: () => require('react-intl-loader?locale=ru!../intl/ru.json'),
    sr: () => require('react-intl-loader?locale=sr!../intl/sr.json'),
};

function loadLocaleData(locale) {
    return new Promise((resolve) => {
        let loader = localeLoaders[locale];
        if (!loader) {
            // use the english locale for unknown ones
            loader = localeLoaders.en;
        }
        loader()(resolve);
    });
}

// this list helps with setting a flag for each language
// using the semantic ui flags css classes
const localeFlags = {
    ca: '',
    cy: 'gb wls',
    de: 'de',
    el: 'gr',
    en: 'gb',
    es: 'es',
    fr: 'fr',
    fy: '',
    gd: 'gb sct',
    it: 'it',
    lt: 'lt',
    nl: 'nl',
    pt: 'pt',
    ru: 'ru',
    sr: 'rs',
};

// this lists the enabled locales, available to users, a subset of the supported ones
// this list also defines the order they are presented in the UI
const enabledLocales = [
    'en',
    'de',
    'it',
    'es',
    'nl',
    'el',
    'ca',
    'sr',
];

export default {
    // locales: Object.keys(localeLoaders),
    locales: enabledLocales,

    loadLocale: function(locale) {
        return loadIntlPolyfill(locale).then(() => {
            return loadLocaleData(locale);
        });
    },

    flagForLocale: function(locale) {
        return localeFlags[locale];
    },
};
