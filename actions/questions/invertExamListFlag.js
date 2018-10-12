const log = require('../log/clog');

export default function invertExamListFlag(context, payload, done) {
    log.info(context);
    context.dispatch('INVERT_EXAM_LIST_FLAG', payload);
    done();
}
