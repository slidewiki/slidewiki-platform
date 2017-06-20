const log = require('../log/clog');

export default function uploadMediaFiles(context, payload, done) {
    log.info(context);
    console.log(payload);
    context.dispatch('START_UPLAODING_MEDIA_FILE', payload);

    // context.service.create('', payload, { timeout: 20 * 1000 }, (err, res) => {
        done();
    // });
}
