import log from '../log/clog';

export default function SendReportShowWrongFields(context, payload, done) {
    log.info(context);
    context.dispatch('REPORT_SHOW_WRONG_FIELDS', payload);
    done();
}
