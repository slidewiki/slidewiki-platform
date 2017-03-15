

export default {

    loadIntlMessages(context, locale, done) {
        //console.log('locaaaaleeeee:' + locale);
        let messages = require('../intl/' + locale+ '.json');
        let locale_file = {
            'locales': [locale],
            'messages' : messages
        };
        context.dispatch('LOAD_INTL_SERVER', locale_file);
        done();
    }

};
