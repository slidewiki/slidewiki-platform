import {shortTitle} from '../configs/general';
const clog = require('./log/clog');

export default function loadImportFile(context, payload, done) {
    clog.info(context, payload);
    context.service.create('import.content', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            clog.error(context, payload, {reqId: payload.navigate.reqId, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('LOAD_IMPORT_FILE_FAILURE', err);
        } else {
            //console.log(res);
            context.dispatch('LOAD_IMPORT_FILE_SUCCESS', res);
        }
        //let pageTitle = shortTitle + ' | Import presentation | ' + payload.params.stype + ' | ' + payload.params.sid;
        //context.dispatch('UPDATE_PAGE_TITLE', {
            //pageTitle: pageTitle
        //});
        done();
    });
}
