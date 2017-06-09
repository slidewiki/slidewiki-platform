/**
 * Created by lfernandes on 24.03.17.
 */

const log = require('../log/clog');

export default function closeReportModal(context, payload, done) {
    log.info(context);
    context.dispatch('REPORT_MODAL_CLOSE', payload);
    done();
}
