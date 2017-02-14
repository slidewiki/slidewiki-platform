

export default {

    loadIntlMessages(context, { locale }, done) {
        //console.log('locaaaaleeeee:' + locale);
        context.dispatch('LOAD_INTL_SERVER', require(`../intl/${locale}`));
        done();
    }

};
