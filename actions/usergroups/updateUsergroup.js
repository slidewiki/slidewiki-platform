const log = require('../log/clog');
import { shortTitle } from '../../configs/general';
import UserProfileStore from '../../stores/UserProfileStore';

export default function updateUsergroup(context, payload, done) {
    log.info(context);

    if (payload.offline) {
        console.warn('updateUsergroup does it offline');
        context.dispatch('UPDATE_USERGROUP', payload.group);
        return done();
    }

    if (!payload.group._id || payload.group._id < 1) {
        context.dispatch('UPDATE_USERGROUP', {
            creator: {
                username: context.getStore(UserProfileStore).username,
                userid: context.getStore(UserProfileStore).userid,
                picture: ''
            },
            name: '',
            description: '',
            members: [],
            picture: ''
        });
        return done();
    }

    let payload2 = {
        groupid: payload.group._id
    };

    context.service.read('usergroup.read', payload2, { timeout: 20 * 1000 }, (err, res) => {
        // console.log('action updateUsergroup called usergroup.read', err, res);
        if (err) {
            context.dispatch('USERGROUP_ERROR', err);
        }
        else {
            context.dispatch('UPDATE_USERGROUP', res[0]);
        }
        done();
    });
}
