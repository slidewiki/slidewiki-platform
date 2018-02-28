const log = require('../log/clog');

export default function invertAddQuestionBoxFlag(context, payload, done) {
    log.info(context);
    context.dispatch('INVERT_ADD_QUESTION_BOX_FLAG', payload);
    done();
}
