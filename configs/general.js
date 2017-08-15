/*
IMPORTANT NOTE:
This file gets overridden by entrypoint.sh with the substitude of general.js.template
*/

import sha512 from 'js-sha512';
const co = require('../common');

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
    locales: ['en', 'de', 'es', 'nl', 'ru', 'el', 'ca', 'gd'],
    //locales: ['en', 'ru'],
    loglevel: 'debug'
};
