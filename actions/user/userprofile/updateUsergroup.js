const log = require('../../log/clog');
import { shortTitle } from '../../../configs/general';

export default function updateUsergroup(context, payload, done) {
    log.info(context);

    if (payload.offline) {
        context.dispatch('UPDATE_USERGROUP', payload.group);
        context.dispatch('UPDATE_PAGE_TITLE', {pageTitle: shortTitle + ' | Edit Group ' + payload.group.name});
        return done();
    }

    let payload2 = {
        groupid: payload.group._id
    };

    context.service.read('usergroup.read', payload2, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            context.dispatch('UPDATE_USERGROUP', payload.group);
        }
        else {
            context.dispatch('UPDATE_USERGROUP', res[0]);
            context.dispatch('UPDATE_PAGE_TITLE', {pageTitle: shortTitle + ' | Edit Group ' + res[0].name});
        }
        done();
    });
}
