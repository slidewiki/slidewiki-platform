import serviceUnavailable from './error/serviceUnavailable';
const clog = require('./log/clog');

export default function loadPresentation(context, payload, done) {
    clog.info(context, payload);
    context.service.read('presentation.content', payload, {timeout: 20 * 1000}, (err, res) => {
      //  console.log('Executing loadPresentation action');
        if (err) {
            clog.error(context, payload, {filepath: __filename, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('LOAD_PRESENTATION_FAILURE', err);
        } else {
            context.dispatch('LOAD_PRESENTATION_SUCCESS', res);
        }

        done();
    });


}
