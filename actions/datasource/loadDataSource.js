export default function loadDataSource(context, payload, done) {
    if (!(/^[0-9a-zA-Z-]+$/.test(payload.params.sid) || payload.params.sid === undefined))
        console.log('Slide id incorrect. Loading data source failed.');

    //context.service.read('datasource.item', payload, {timeout: 20 * 1000}, (err, res) => {
    //    if (err) {
    //        context.dispatch('LOAD_DATASOURCE_FAILURE', err);
    //    } else {
    //        context.dispatch('LOAD_DATASOURCE_SUCCESS', res);
    //    }

    //    done();
    //});

    context.dispatch('LOAD_DATASOURCE', payload);
}
