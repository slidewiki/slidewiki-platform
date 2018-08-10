const log = require('../log/clog');

export default function editImageWithSrc(context, src, done) {
    log.info(context);
    // Split just in case it has the time trick to update cache.
    let url = src.split('?')[0];
    let extension = url.split('.')[src.split('.').length - 1];
    if (extension === 'svg') {
        context.service.read('media.readCSV', {url: url}, { timeout: 20 * 1000 }, (err, res) => {
            context.dispatch('OPEN_WITH_SRC', {url: url, svg: res});
            done();
        });
    } else {
        context.dispatch('OPEN_PICTURE', {url: url});
        done();
    }
}
