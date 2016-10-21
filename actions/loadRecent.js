export default function loadRecent(context, payload, done) {
    context.service.read('deck.recent', payload, {timeout: 20 * 1000}, (err, res) => {
      //  console.log('Executing loadPresentation action');
        if (err) {
            context.dispatch('LOAD_HOME_PAGE_FAILURE', err);
        } else {
            context.dispatch('LOAD_RECENT_SUCCESS', res);
        }
        done();
    });

}
