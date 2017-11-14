import log from '../log/clog';

export default function closeReportModal(context, payload, done) {
    log.info(context);
    context.dispatch('REPORT_MODAL_CLOSE', payload);
    done();
}
