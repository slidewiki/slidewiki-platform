export default function checkNoOfSlides(context, payload, done) {
    context.service.read('deck.numberofslides', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            console.log('actionError', err);
            // context.dispatch('LOAD_SLIDE_ALL_FAILURE', err);
        } else {
            // console.log('actionRes', res);
            context.dispatch('SLIDES_PROGRESS', res);
        }

        done();
    });
}
