const log = require('./log/clog');

export function updateAuthorizedUsers(context, payload, done) {
    log.info(context);
    context.dispatch('UPDATE_AUTHORIZED_USERS', payload);
    done();
}

export function updateAuthorizedGroups(context, payload, done) {
    log.info(context);
    context.dispatch('UPDATE_AUTHORIZED_GROUPS', payload);
    done();
}
