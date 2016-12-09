import { logger, breadcrumb} from '../configs/log';
import serviceUnavailable from './error/serviceUnavailable';

export default function loadFeatured(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, navStack: context.stack});
    context.service.read('deck.featured', payload, {timeout: 20 * 1000}, (err, res) => {
      //  console.log('Executing loadPresentation action');
        if (err) {
            console.log(err);
            logger.error({reqId: payload.navigate.reqId, err: {uri: err.uri, statusCode: err.statusCode, message: err.message}});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('LOAD_FEATURED_FAILURE', err);
        } else {
            context.dispatch('LOAD_FEATURED_SUCCESS', res);
        }
        done();
    });
}
