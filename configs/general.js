/*
IMPORTANT NOTE:
This file gets overridden by entrypoint.sh with the substitude of general.js.template
*/

import sha512 from 'js-sha512';
const co = require('../common');
import ISO6391 from 'iso-639-1';
import locale from 'locale-code';

export default {
    //full page title
    fullTitle: ['SlideWiki -- Authoring platform for OpenCourseWare'],
    //short page title
    shortTitle: ['SlideWiki'],
    hashPassword: function(password) {
        let hashSalt = '6cee6c6a420e0573d1a4ad8ecb44f2113d010a0c3aadd3c1251b9aa1406ba6a3'; //salt for password hashing
        return sha512.sha512(password + hashSalt);
    },
    hashingSalt: '6cee6c6a420e0573d1a4ad8ecb44f2113d010a0c3aadd3c1251b9aa1406ba6a3',
    //Public reCAPTCHA key
    publicRecaptchaKey: '6LdNLyYTAAAAAINDsVZRKG_E3l3Dvpp5sKboR1ET',
    locales: ['en', 'de', 'it', 'es', 'nl', 'el', 'ca', 'sr'],
    loglevel: 'debug',
    ssoEnabled: true,
    getLanguageName: (code) => {
        if (code.length === 2)
            return ISO6391.getName(code.toLowerCase());
        if (code.length === 5)
            return locale.getLanguageName(code.replace('_', '-'));
        return '';
    },
    getLanguageNativeName: (code) => {
        if (code.length === 2)
            return ISO6391.getNativeName(code.toLowerCase());
        if (code.length === 5)
            return locale.getLanguageNativeName(code.replace('_', '-'));
        return '';
    },
    compareLanguageCodes: (a, b) => {
        if (a.length === 5 && b.length === 5)
            return a.replace('_', '-') === b.replace('_', '-');
        return a.substring(0,2).toLowerCase() === b.substring(0,2).toLowerCase();
    }
};
