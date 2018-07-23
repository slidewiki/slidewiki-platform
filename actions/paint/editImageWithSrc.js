const log = require('../log/clog');

export default function editImageWithSrc(context, url, done) {
    log.info(context);
    context.service.read('media.readCSV', {url: url}, { timeout: 20 * 1000 }, (err, res) => {
        context.dispatch('OPEN_WITH_SRC', res);
        done();
    });
}
