// this file includes the UI locales supported
// and some code supporting loading intl libraries and assets
import debug from 'debug';
import isIntlLocaleSupported from 'intl-locales-supported';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';
import es from 'react-intl/locale-data/es';
import ru from 'react-intl/locale-data/ru';
import de from 'react-intl/locale-data/de';
import ca from 'react-intl/locale-data/ca';
import gd from 'react-intl/locale-data/gd';
import nl from 'react-intl/locale-data/nl';
import el from 'react-intl/locale-data/el';
import it from 'react-intl/locale-data/it';
import cy from 'react-intl/locale-data/cy';

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
    ca: async () => await import('../intl/ca.json'),
    cy: async () => await import('../intl/cy.json'),
    de: async () => await import('../intl/de.json'),
    el: async () => await import('../intl/el.json'),
    en: async () => await import('../intl/en.json'),
    es: async () => await import('../intl/es.json'),
    fr: async () => await import('../intl/fr.json'),
    fy: async () => await import('../intl/fy.json'),
    gd: async () => await import('../intl/gd.json'),
    it: async () => await import('../intl/it.json'),
    nl: async () => await import('../intl/nl.json'),
    pt: async () => await import('../intl/pt.json'),
    ru: async () => await import('../intl/ru.json'),
    sr: async () => await import('../intl/sr.json'),
};

function loadLocaleData(locale) {    
    addLocaleData([...en, ...fr, ...es, ...ru, ...de, ...ca, ...gd, ...nl, ...el, ...it, ...cy]);
    return localeLoaders[locale]();
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
    'fr',
    'it',
    'es',
    'nl',
    'pt',
    'el',
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
