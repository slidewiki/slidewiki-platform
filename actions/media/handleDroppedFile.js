const log = require('../log/clog');

export default function uploadMediaFile(context, payload, done) {
    log.info(context);
    console.log('//////////////////action');
    console.log(payload);
    context.dispatch('HANDLE_DROPPED', payload);
    done();
}
