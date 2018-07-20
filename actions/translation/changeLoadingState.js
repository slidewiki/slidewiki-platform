const log = require('../log/clog');

export default function changeLoadingState(context, payload, done) {
    log.info(context);

    context.dispatch('TRANSLATION_NEW_LOADING_STATE', payload.isLoading);
    done();
}
