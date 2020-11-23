import {shortTitle} from '../configs/general';
const log = require('./log/clog');

export default function loadImportFile(context, payload, done) {
    log.info(context);
    context.service.create('import.content', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('LOAD_IMPORT_FILE_FAILURE', err);
        } else {
            //console.log(res);
            context.dispatch('LOAD_IMPORT_FILE_SUCCESS', res);
        }

        done();
    });
}
