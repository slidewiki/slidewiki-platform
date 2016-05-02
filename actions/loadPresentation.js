export default function loadPresentation(context, payload, done) {
  context.service.read('datasource.count', payload, {timeout: 20 * 1000}, (err, res) => {
      if (err) {
          context.dispatch('LOAD_PRESENTATION_FAILURE', err);
      } else {
          context.dispatch('LOAD_PRESENTATION_SUCCESS', res);
      }

      done();
  });


}
