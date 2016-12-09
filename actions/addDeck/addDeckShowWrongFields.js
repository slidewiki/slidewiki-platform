import {shortTitle} from '../../configs/general';
import { logger, breadcrumb} from '../../configs/log';

export default function addDeckShowWrongFields(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, navStack: context.stack});
    context.dispatch('SHOW_WRONG_FIELDS', payload);
    done();
}
