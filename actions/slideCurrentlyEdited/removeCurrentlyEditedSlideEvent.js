import log from '../log/clog';

export default function removeCurrentlyEditedSlideEvent(context, payload, done) {

    log.info(context);

    if (payload.id === null) done();

    context.service.delete('slidesCurrentlyEdited.deleteEvent', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            // console.log(err);
        }

        let params = {
            eventId: ''
        };
        context.dispatch('UPDATE_EVENT_ID', params);
        done();
    });

}
