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
    //API Key
    resetPasswordAPIKey: (!co.isEmpty(process.env.SERVICE_USER_APIKEY)) ? process.env.SERVICE_USER_APIKEY : '2cbc621f86e97189239ee8c4c80b10b3a935b8a9f5db3def7b6a3ae7c4b75cb5',
    //Public reCAPTCHA key
    publicRecaptchaKey: '6LdNLyYTAAAAAINDsVZRKG_E3l3Dvpp5sKboR1ET'
};
