import ISO6391 from 'iso-639-1';
import { sha512 } from 'js-sha512';
import { hashingSalt } from './configs/general';

export default {

    hashPassword: function(password) {
        return sha512(password + hashingSalt);
    },

    writeCookie(name, value, days) {
        let expires;

        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toGMTString();
        }
        else {
            expires = '';
        }

        document.cookie = name + '=' + value + expires + '; path=/';
    },

    getIntlMessage: function(messages, path) {
        const pathParts = path.split('.');
        let message;

        try {
            message = pathParts.reduce((obj, pathPart) => obj[pathPart], messages);
        } finally {
            if (message === undefined) {
                throw new ReferenceError('Could not find Intl message: ' + path);
            }
        }

        return message;
    },

    isEmpty: function(toTest) {
        return (toTest === undefined ||
            toTest === null ||
            toTest === '' ||
            (toTest instanceof Object && Object.keys(toTest).length === 0) ||
            (toTest instanceof Array && toTest.length === 0));
    },

    assignToAllById(original, update) {
        original.forEach((val) => {
            // if not found does nothing :)
            Object.assign(val, update.find((el) => el.id === val.id) );
        });
        return original;
    },

    timeSince: function(date) {
        let seconds = Math.floor((new Date() - date) / 1000);
        let interval = Math.floor(seconds / 31536000);

        if (interval > 1) {
            return interval + ' years';
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + ' months';
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + ' days';
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + ' hours';
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + ' minutes';
        }
        return Math.floor(seconds) + ' seconds';
    },

    getIntlLanguage() {
        let language = 'en';
        if (document.cookie.indexOf('locale=') > 0)
            language = document.cookie.substr(document.cookie.indexOf('locale=') + 7, 2);

        return language;
    },

    isLocalStorageOn: function() {
        let mod = 'react-count';
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    },

    arraysEqual: (arr1, arr2) => {
        if (arr1.length !== arr2.length)
            return false;
        for(let i = arr1.length; i--;) {
            if(arr1[i] !== arr2[i])
                return false;
        }

        return true;
    },

    arraysContainTheSameIdsInTheirObjects: (a, b) => {
        if (a === undefined && b === undefined)
            return true;
        if ((a === undefined && b !== undefined) || (a !== undefined && b === undefined))
            return false;
        if (a.length !== b.length)
            return false;
        for (let key in a) {
            const element = a[key];
            const found = b.findIndex((e) => {return e.id === element.id;}) !== -1;
            if (!found)
                return false;
        }
        for (let key in b) {
            const element = b[key];
            const found = a.findIndex((e) => {return e.id === element.id;}) !== -1;
            if (!found)
                return false;
        }
        return true;
    },

    isEmailAddress: (email) => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },

    // some locale support aux code
    getLanguageName: (code) => {
        if (!code) return '';

        // also returns empty string if unknown
        return ISO6391.getName(code.substring(0, 2).toLowerCase());
    },

    getLanguageNativeName: (code) => {
        if (!code) return '';

        // also returns empty string if unknown
        return ISO6391.getNativeName(code.substring(0, 2).toLowerCase());
    },

    getLanguageDisplayName: (code) => {
        if (!code) return '';
        code = code.substring(0, 2).toLowerCase();

        let name = ISO6391.getName(code);
        // also returns empty string if unknown
        if (!name) return '';

        let nativeName = ISO6391.getNativeName(code);
        if (nativeName === name) return name;

        return `${nativeName} (${name})`;
    },

    compareLanguageCodes: (a, b) => {
        if (a === b) return true;
        if (!a || !b) return false;

        if (a.length === 5 && b.length === 5)
            return a.replace('_', '-') === b.replace('_', '-');
        return a.substring(0,2).toLowerCase() === b.substring(0,2).toLowerCase();
    },

    //ISO6391 language codes from https://pkgstore.datahub.io/core/language-codes/language-codes_csv/data/b65af208b52970a4683fa8fde9af8e9f/language-codes_csv.csv
    translationLanguages: [
        'de',
        'el',
        'en',
        'es',
        'fr',
        'it',
        'sr',
        'lt',
        'nl',
        'pt',
        'ru',
        'zh',
        'hi',
        'ar',
        'bn',
        'ja',
        'pa',
        'jv',
        'ml',
        'aa',
        'ab',
        'ae',
        'af',
        'ak',
        'am',
        'an',
        'as',
        'av',
        'ay',
        'az',
        'ba',
        'be',
        'bg',
        'bh',
        'bi',
        'bm',
        'bo',
        'br',
        'bs',
        'ca',
        'ce',
        'ch',
        'co',
        'cr',
        'cs',
        'cu',
        'cv',
        'cy',
        'da',
        'dv',
        'dz',
        'ee',
        'eo',
        'et',
        'eu',
        'fa',
        'ff',
        'fi',
        'fj',
        'fo',
        'fy',
        'ga',
        'gd',
        'gl',
        'gn',
        'gu',
        'gv',
        'ha',
        'he',
        'ho',
        'hr',
        'ht',
        'hu',
        'hy',
        'hz',
        'ia',
        'id',
        'ie',
        'ig',
        'ii',
        'ik',
        'io',
        'is',
        'iu',
        'ka',
        'kg',
        'ki',
        'kj',
        'kk',
        'kl',
        'km',
        'kn',
        'ko',
        'kr',
        'ks',
        'ku',
        'kv',
        'kw',
        'ky',
        'la',
        'lb',
        'lg',
        'li',
        'ln',
        'lo',
        'lu',
        'lv',
        'mg',
        'mh',
        'mi',
        'mk',
        'mn',
        'mr',
        'ms',
        'mt',
        'my',
        'na',
        'nb',
        'nd',
        'ne',
        'ng',
        'nn',
        'no',
        'nr',
        'nv',
        'ny',
        'oc',
        'oj',
        'om',
        'or',
        'os',
        'pi',
        'pl',
        'ps',
        'qu',
        'rm',
        'rn',
        'ro',
        'rw',
        'sa',
        'sc',
        'sd',
        'se',
        'sg',
        'si',
        'sk',
        'sl',
        'sm',
        'sn',
        'so',
        'sq',
        'ss',
        'st',
        'su',
        'sv',
        'sw',
        'ta',
        'te',
        'tg',
        'th',
        'ti',
        'tk',
        'tl',
        'tn',
        'to',
        'tr',
        'ts',
        'tt',
        'tw',
        'ty',
        'ug',
        'uk',
        'ur',
        'uz',
        've',
        'vi',
        'vo',
        'wa',
        'wo',
        'xh',
        'yi',
        'yo',
        'za',
        'zu'
    ],

};
