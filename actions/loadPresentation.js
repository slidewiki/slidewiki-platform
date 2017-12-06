import serviceUnavailable from './error/serviceUnavailable';
const log = require('./log/clog');

export default function loadPresentation(context, payload, done) {
    log.info(context);
    context.service.read('presentation.content', payload, {timeout: 20 * 1000}, (err, res) => {
        //  console.log('Executing loadPresentation action');
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('LOAD_PRESENTATION_FAILURE', err);
        } else {
            context.dispatch('LOAD_PRESENTATION_SUCCESS', res);
        }

        done();
    });


}
