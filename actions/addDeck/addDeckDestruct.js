import {shortTitle} from '../../configs/general';
import { logger, breadcrumb} from '../../configs/log';

export default function addDeckDestruct(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, breadcrumb: breadcrumb(context.stack)});
    context.dispatch('DESTRUCT', payload);
    done();
}
