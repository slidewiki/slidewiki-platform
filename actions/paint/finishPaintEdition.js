const log = require('../log/clog');

export default function finishPaintEdition(context, payload, done) {
    log.info(context);

    context.dispatch('FINISH_EDITION');
    done();
}
