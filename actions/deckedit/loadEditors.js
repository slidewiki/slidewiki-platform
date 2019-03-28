import log from '../log/clog';
import UserProfileStore from '../../stores/UserProfileStore';

export default function loadEditors(context, payload, done) {
    log.info(context);
    context.dispatch('START_TRANSFER_OWNERSHIP');

    let userid = context.getStore(UserProfileStore).userid;
    const groupids = payload.groups.map((group) => parseInt(group.id, 10));

    if (groupids.length < 1) {
        context.dispatch('LOAD_EDITORS_LIST_SUCCESS', payload.users);
        return done();
    }

    context.service.read('usergroup.getList', {groupids}, { timeout: 20 * 1000 }, (err, res) => { // payload needs groupids
        if (err) {
            context.dispatch('LOAD_EDITORS_LIST_ERROR', err);
        }
        else {
            let users = payload.users;
            users = users.concat(res.reduce((ret, group) => {
                ret.push(group.creator);
                return ret.concat(group.members);
            }, []));

            // purge duplicates and current user
            users = users.reduce((ret, user) => {
                let found = ret.find((u) => ((u.id || u.userid) === (user.id || user.userid)));
                if (!found && (user.id || user.userid) !== userid) {
                    ret.push(user);
                }
                return ret;
            }, []);

            // console.log('got all editors', users);
            context.dispatch('LOAD_EDITORS_LIST_SUCCESS', users);
        }
        done();
    });
}
