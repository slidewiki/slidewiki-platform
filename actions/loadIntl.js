

export default {

    loadIntlMessages(context, { locale }, done) {
        //console.log('locaaaaleeeee:' + locale);
        try {
            require(`../intl/${locale}`);
        }
        catch (err) {
            done (err);
        }
        context.dispatch('LOAD_INTL_SERVER', require(`../intl/${locale}`));
        done();
    }

};
