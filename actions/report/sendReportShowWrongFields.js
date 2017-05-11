/**
 * Created by lfernandes on 12.03.17.
 */

const log = require('../log/clog');

export default function SendReportShowWrongFields(context, payload, done) {
    log.info(context);
    context.dispatch('REPORT_SHOW_WRONG_FIELDS', payload);
    done();
}
