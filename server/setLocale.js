// Express middleware to overwrite the locale from cookie or querystring

import {locales } from '../configs/general';

export default function setLocale(req, res, next) {
    console.log('Detected locale (from browser) is %s', req.locale);

    // Locale can be changed by passing ?locale=<locale> in the querystring

    if (req.query.locale) {
        // But only the supported ones!
        if (locales.indexOf(req.query.locale) > -1) {
            req.locale = req.query.locale;
            console.log('Locale has been set from querystring: %s', req.locale);
        }else{
            console.log(locales[0]);
        }
    }

    // Or by setting a `locale` cookie
    else if (req.cookies.locale) {
        if (locales.indexOf(req.cookies.locale) > -1) {
            req.locale = req.cookies.locale;
            console.log('Locale has been set from cookie: %s', req.locale);
        }else{
            console.log(locales[0]);
        }
    }

    next();
}
