const log = require('../../log/clog');
import { shortTitle } from '../../../configs/general';

export default function updateUsergroup(context, payload, done) {
    log.info(context);

    if (payload.offline) {
        context.dispatch('UPDATE_USERGROUP', payload.group);
        context.dispatch('UPDATE_PAGE_TITLE', {pageTitle: shortTitle + ' | Edit Group ' + payload.group.name});
        return done();
    }
    if (payload.showDetails) {
        context.dispatch('UPDATE_USERGROUPS_STATUS', null);
    }

    let payload2 = {
        groupid: payload.group._id
    };

    context.service.read('usergroup.read', payload2, { timeout: 20 * 1000 }, (err, res) => {
        // console.log('usergroup.read returned', err, res);
        if (err) {
            if (payload.showDetails)
                payload.group.details = true;
            context.dispatch('UPDATE_USERGROUP', payload.group);
        }
        else {
            if (payload.showDetails)
                res[0].details = true;
            else
                context.dispatch('UPDATE_PAGE_TITLE', {pageTitle: shortTitle + ' | Edit Group ' + res[0].name});
            context.dispatch('UPDATE_USERGROUP', res[0]);
        }
        done();
    });
}
