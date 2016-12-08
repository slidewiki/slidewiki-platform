import { logger, breadcrumb} from '../configs/log';
import serviceUnavailable from './error/serviceUnavailable';

export default function loadRecent(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, breadcrumb: breadcrumb(context.stack)});
    context.service.read('deck.recent', payload, {timeout: 20 * 1000}, (err, res) => {
      //  console.log('Executing loadPresentation action');
        if (err) {
            logger.error({reqId: payload.navigate.reqId, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('LOAD_HOME_PAGE_FAILURE', err);
        } else {
            context.dispatch('LOAD_RECENT_SUCCESS', res);
        }
        done();
    });
}
