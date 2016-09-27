import {shortTitle} from '../configs/general';
export default function loadImportFile(context, payload, done) {
    //console.log('test');
    //console.log(payload);
    context.service.create('import.content', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('LOAD_IMPORT_FILE_FAILURE', err);
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
