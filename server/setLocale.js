// Express middleware to overwrite the locale from cookie or querystring

import {locales } from '../configs/general';
import locale from 'locale';

export default function setLocale(req, res, next) {


    console.log('Detected locale (from browser) is %s', req.locale);

    try {
        require('../intl/' + req.locale +'.json');

    }
    catch (err){
        console.log('Locale not found: ' + req.locale +'. Using the default');
        req.locale = locale.Locale.default;
    }

    // Locale can be changed by passing ?locale=<locale> in the querystring

    if (req.query.locale) {
        try {
            require('../intl/' + req.query.locale +'.json');
            // But only the supported ones!
            if (locales.indexOf(req.query.locale) > -1) {
                req.locale = req.query.locale;
                console.log('Locale has been set from querystring: %s', req.locale);
            }
        }
        catch (err){
            console.log('Locale not found:' + req.query.locale +'. Using the default');
        }

    }

    // Or by setting a `locale` cookie
    else if (req.cookies.locale) {
        try {
            require('../intl/' + req.cookies.locale +'.json');
            if (locales.indexOf(req.cookies.locale) > -1) {
                req.locale = req.cookies.locale;
                console.log('Locale has been set from cookie: %s', req.locale);
            }
        }
        catch (err){
            console.log('Locale not found:' + req.cookies.locale +'. Using the default');
        }
    }

    next();
}
