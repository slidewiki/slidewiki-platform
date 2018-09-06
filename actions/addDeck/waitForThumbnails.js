const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function waitForThumbnails(context, payload, done) {
    log.info(context);
    context.service.read('import.thumbnails', payload, {timeout: 20 * 1000}, (err, res) => {
        if (!err) {
            context.dispatch('THUMBNAIL_SUCCESS', {id: payload.slide.id, thumbnail: res});
        } else {
            context.dispatch('THUMBNAIL_FAILED', {id: payload.slide.id, thumbnail: null});
        }
        done();
    });
}
