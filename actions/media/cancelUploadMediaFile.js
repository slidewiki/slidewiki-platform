const log = require('../log/clog');

export default function uploadMediaFile(context, payload, done) {
    log.info(context);
    context.dispatch('CANCEL_UPLOADING_MEDIA_FILE', payload);
    done();
}
