/**
 * Created by lfernandes on 24.03.17.
 */

const log = require('../log/clog');

export default function openReportModal(context, payload, done) {
    log.info(context);
    context.dispatch('REPORT_MODAL_OPEN', payload);
    done();
}
