const log = require('../log/clog');

//TODO delete if not needed
export default function cancelEditTag(context, payload, done) {
    log.info(context);
    context.dispatch('CANCEL_EDIT_DATASOURCE');
    done();
}
