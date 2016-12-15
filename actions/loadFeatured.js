const clog = require('./log/clog');
import serviceUnavailable from './error/serviceUnavailable';

export default function loadFeatured(context, payload, done) {
    clog.info(context, payload);
    context.service.read('deck.featured', payload, {timeout: 20 * 1000}, (err, res) => {
      //  console.log('Executing loadPresentation action');
        if (err) {
            console.log(err);
            clog.error(context, payload, {reqId: payload.navigate.reqId, err: {uri: err.uri, statusCode: err.statusCode, message: err.message}});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('LOAD_FEATURED_FAILURE', err);
        } else {
            context.dispatch('LOAD_FEATURED_SUCCESS', res);
        }
        done();
    });
}
