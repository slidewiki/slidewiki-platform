export default function loadDataSourceCount(context, payload, done) {
    context.service.read('datasource.count', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('LOAD_AMOUNT_OF_DATA_SOURCES_FAILURE', err);
        } else {
            context.dispatch('LOAD_AMOUNT_OF_DATA_SOURCES_SUCCESS', res);
        }

        done();
    });
}
