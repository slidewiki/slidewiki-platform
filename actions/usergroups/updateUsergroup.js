const log = require('../log/clog');
import { shortTitle } from '../../configs/general';

export default function updateUsergroup(context, payload, done) {
    log.info(context);

    if (payload.offline) {
        console.warn('updateUsergroup does it offline');
        context.dispatch('UPDATE_USERGROUP', payload.group);
        context.dispatch('UPDATE_PAGE_TITLE', {pageTitle: shortTitle + ' | Details of user group ' + payload.group.name});
        return done();
    }

    let payload2 = {
        groupid: payload.group._id
    };

    context.service.read('usergroup.read', payload2, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            context.dispatch('USERGROUP_ERROR', err);
        }
        else {
            context.dispatch('UPDATE_USERGROUP', res[0]);
            //context.dispatch('UPDATE_PAGE_TITLE', {pageTitle: shortTitle + ' | Details of user group ' + res[0].name});
        }
        done();
    });
}
