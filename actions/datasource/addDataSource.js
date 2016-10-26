export default function addDataSource(context, payload, done) {
    context.service.create('datasource.new', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('ADD_DATASOURCE_FAILURE', err);
        } else {
            context.dispatch('ADD_DATASOURCE_SUCCESS', res);
        }

        done();
    });
}
