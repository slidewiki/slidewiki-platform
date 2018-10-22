const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function updateDownloadQuestions(context, payload, done) {
    log.info(context);
    context.dispatch('UPDATE_DOWNLOAD_QUESTIONS', payload);
    done(); 
}
