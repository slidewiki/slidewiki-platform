export default function loadPresentation(context, payload, done) {
    context.service.read('presentation.content', payload, {timeout: 20 * 1000}, (err, res) => {
        console.log('Executing loadPresentation action');
        if (err) {
            context.dispatch('LOAD_PRESENTATION_FAILURE', err);
        } else {
            context.dispatch('LOAD_PRESENTATION_SUCCESS', res);
        }

        done();
    });


}
