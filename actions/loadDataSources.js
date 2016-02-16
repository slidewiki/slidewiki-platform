import {shortTitle} from '../configs/general';
export default function loadDataSource(context, payload, done) {
    context.service.read('datasource.list', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('LOAD_DATASOURCES_FAILURE', err);
        } else {
            context.dispatch('LOAD_DATASOURCES_SUCCESS', res);
        }
        let pageTitle = shortTitle + ' | Data Sources | ' + payload.params.stype + ' | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
