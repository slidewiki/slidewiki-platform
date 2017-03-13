import serviceUnavailable from './error/serviceUnavailable';
const log = require('./log/clog');

export default function loadRecent(context, payload, done) {
    log.info(context);
    context.service.read('deck.recent', payload, {timeout: 20 * 1000}, (err, res) => {
      //  console.log('Executing loadPresentation action');
        if (err) {
            log.error(context, {filepath: __filename, err: err.message});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('LOAD_HOME_PAGE_FAILURE', err);
        } else {
            context.dispatch('LOAD_RECENT_SUCCESS', res);
        }
        done();
    });
}
