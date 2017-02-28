export default function loadFeatured(context, payload, done) {
    context.service.read('deck.featured', payload, {timeout: 20 * 1000}, (err, res) => {
      //  console.log('Executing loadPresentation action');
        if (err) {
            context.dispatch('LOAD_FEATURED_FAILURE', err);
        } else {
            context.dispatch('LOAD_FEATURED_SUCCESS', res);
        }
        done();
    });
}
