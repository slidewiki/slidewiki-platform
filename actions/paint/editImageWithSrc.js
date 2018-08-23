const log = require('../log/clog');

export default function editImageWithSrc(context, src, done) {
    log.info(context);
    // Split just in case it has the time trick to update cache.
    let url = src.split('?')[0];
    let extension = url.split('.')[src.split('.').length - 1];
    context.service.read('media.readMetadata', {url: url}, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            done();
        } else {
            res = JSON.parse(res);
            let fileType = res.type;
            let altText = res.altText;
            let title = res.title;
            if (fileType === 'image/svg+xml') {
                context.service.read('media.readCSV', {url: url}, { timeout: 20 * 1000 }, (err, res) => {
                    let params = {
                        url: url,
                        svg: res,
                        title: title,
                        altText: altText,
                        toEdit: 'SVG'
                    }
                    context.dispatch('OPEN_WITH_SRC', );
                    done();
                });
            } else {
                context.dispatch('OPEN_PICTURE', {url: url, title: title, altText: altText});
                done();
            }
        }
    });
}
