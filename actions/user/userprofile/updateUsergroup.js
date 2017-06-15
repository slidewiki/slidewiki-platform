const log = require('../../log/clog');

export default function updateUsergroup(context, payload, done) {
    log.info(context);

    if (payload.offline) {
        context.dispatch('UPDATE_USERGROUP', payload.group);
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
        }
        done();
    });
}
