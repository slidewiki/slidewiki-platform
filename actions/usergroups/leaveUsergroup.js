import UserProfileStore from '../../stores/UserProfileStore';
import {navigateAction} from 'fluxible-router';
const log = require('../log/clog');

export default function leaveUsergroup(context, payload, done) {
    log.info(context);

    context.dispatch('UPDATE_USERGROUPS_STATUS', null);
    payload.jwt = context.getStore(UserProfileStore).jwt;
    context.service.update('userProfile.leaveUsergroup', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            context.dispatch('LEAVE_USERGROUP_FAILED', err);
        } else {
            context.dispatch('LEAVE_USERGROUP_SUCCESS', payload.groupid);
            context.executeAction(navigateAction, {
                url: `/user/${context.getStore(UserProfileStore).username}/groups/overview`
            });
        }
        done();
    });
}
