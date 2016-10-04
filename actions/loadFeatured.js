export default function loadFeatured(context, payload, done) {
    context.service.read('home.featured', payload, {timeout: 20 * 1000}, (err, res) => {
      //  console.log('Executing loadPresentation action');
        if (err) {
            context.dispatch('LOAD_HOME_PAGE_FAILURE', err);
        } else {
            context.dispatch('LOAD_HOME_PAGE_SUCCESS', res);
        }
        done();
    });


}
