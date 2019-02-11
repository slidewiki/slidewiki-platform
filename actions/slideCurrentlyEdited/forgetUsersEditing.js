import log from '../log/clog';

export default function forgetUsersEditing(context, payload, done) {

    log.info(context);

    if (payload !== {}) done();

    context.dispatch('DELETE_USERS_EDITING_LIST');
    done();

}
