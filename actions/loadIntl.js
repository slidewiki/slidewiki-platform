

export default {

    loadIntlMessages(context, locale, done) {
        let messages = require('../intl/' + locale+ '.json');
        let locale_file = {
            'locales': [locale],
            'messages' : messages
        };
        context.dispatch('LOAD_INTL_MESSAGES', locale_file);
        done();
    }

};
