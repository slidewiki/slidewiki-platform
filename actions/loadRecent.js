const clog = require('./log/clog');
import serviceUnavailable from './error/serviceUnavailable';

export default function loadRecent(context, payload, done) {
    clog.info(context, payload);
    context.service.read('deck.recent', payload, {timeout: 20 * 1000}, (err, res) => {
      //  console.log('Executing loadPresentation action');
        if (err) {
            clog.error(context, payload, {reqId: payload.navigate.reqId, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('LOAD_HOME_PAGE_FAILURE', err);
        } else {
            context.dispatch('LOAD_RECENT_SUCCESS', res);
        }
        done();
    });
}
