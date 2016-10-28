export default function saveDataSource(context, payload, done) {
    context.service.update('datasource.array', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('SAVE_DATASOURCES_FAILURE', err);
        } else {
            context.dispatch('SAVE_DATASOURCES_SUCCESS', res);
        }

        done();
    });
}
