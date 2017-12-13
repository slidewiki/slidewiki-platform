import log from '../log/clog';

export default function sendReport(context,payload,done){
    log.info(context);

    context.service.create('email', {subject: payload.subject, message: payload.text}, { timeout: 20 * 1000 }, (err, res) => {

        if (err) {
            swal({
                title: payload.swal_messages.title,
                text: payload.swal_messages.error_text,
                type: 'error',
                confirmButtonText: payload.swal_messages.error_confirmButtonText,
                confirmButtonClass: 'positive ui button',
                allowEscapeKey: false,
                allowOutsideClick: false,
                buttonsStyling: false
            });

        } else {
            swal({
                title: payload.swal_messages.title,
                text:payload.swal_messages.text,
                type: 'success',
                confirmButtonText: payload.swal_messages.confirmButtonText,
                confirmButtonClass: 'positive ui button',
                allowEscapeKey: false,
                allowOutsideClick: false,
                buttonsStyling: false
            });
        }
        done();
    });
}
