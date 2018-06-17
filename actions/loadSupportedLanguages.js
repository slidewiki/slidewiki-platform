import serviceUnavailable from './error/serviceUnavailable';
const log = require('./log/clog');

export default function loadSupportedLanguages(context, payload, done) {
    log.info(context);
    context.service.read('translation.supported', payload, {timeout: 20 * 1000}, (err, res) => {
      //  console.log('Executing loadPresentation action');
        if (err) {
            log.error(context, {filepath: __filename, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('LOAD_FEATURED_FAILURE', err);
        } else {
            context.dispatch('LOAD_SUPPORTED_LANGS_SUCCESS', res);
        }
        done();
    });
}
