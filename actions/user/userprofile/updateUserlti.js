const log = require('../../log/clog');
import { shortTitle } from '../../../configs/general';

export default function updateUserlti(context, payload, done) {
    log.info(context);

    if (payload.offline) {
        context.dispatch('UPDATE_USERLTI', payload.lti);
        context.dispatch('UPDATE_PAGE_TITLE', {pageTitle: shortTitle + ' | Edit LTI ' + payload.lti.name});
        return done();
    }

    let payload2 = {
        ltiid: payload.lti._id
    };

    context.service.read('userlti.read', payload2, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            context.dispatch('UPDATE_USERLTI', payload.lti);
        }
        else {
            context.dispatch('UPDATE_USERLTI', res[0]);
            context.dispatch('UPDATE_PAGE_TITLE', {pageTitle: shortTitle + ' | Edit LTI ' + res[0].name});
        }
        done();
    });
}
