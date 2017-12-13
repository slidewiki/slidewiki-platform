import log from '../log/clog';

export default function openReportModal(context, payload, done) {
    log.info(context);
    context.dispatch('REPORT_MODAL_OPEN', payload);
    done();
}
