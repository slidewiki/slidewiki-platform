import {shortTitle} from '../configs/general';
//TODO: add logic here or in service to check if file is valid, based on file extension, content size, encoding, etc..
//    context.service.post('import.checkfile', payload, {timeout: 20 * 1000}, (err, res) => {
export default function importFileSelect(context, payload, done) {
    context.dispatch('IMPORT_FRONTEND_SUCCESS', payload);
    done();
}
