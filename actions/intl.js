

export default {

    loadIntlMessages(context, locale, done) {
        context.dispatch('LOAD_INTL_SERVER', require('../intl/' + locale));
        done();
    }

};
