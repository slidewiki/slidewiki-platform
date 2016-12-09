import { logger, breadcrumb} from '../../configs/log';
import serviceUnavailable from '../error/serviceUnavailable';

export default function checkNoOfSlides(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, navStack: context.stack});
    context.service.read('deck.numberofslides', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            logger.error({reqId: payload.navigate.reqId, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            // context.dispatch('LOAD_SLIDE_ALL_FAILURE', err);
        } else {
            // console.log('actionRes', res);
            context.dispatch('SLIDES_PROGRESS', res);
        }

        done();
    });
}
