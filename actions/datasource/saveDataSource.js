export default function saveDataSource(context, payload, done) {
    context.service.update('datasource.item', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('SAVE_DATASOURCE_FAILURE', err);
        } else {
            context.dispatch('SAVE_DATASOURCE_SUCCESS', res);
        }

        done();
    });
}
