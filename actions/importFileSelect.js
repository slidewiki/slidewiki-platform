import {shortTitle} from '../configs/general';
//TODO: add logic here or in service to check if file is valid, based on file extension, content size, encoding, etc..
//    context.service.post('import.checkfile', payload, {timeout: 20 * 1000}, (err, res) => {
//pptx2html = require('../PPTX2HTML/js/pptx2html');
import pptx2html from '../components/Import/PPTX2HTML/js/pptx2html';
//import Promise from 'promise';
export default function importFileSelect(context, payload, done) {
    //let result;
    //let callbackresult;
//    result = pptx2html.convert(payload.file => callbackresult);
//    console.log(result);
    context.dispatch('IMPORT_FILE_SELECT', payload);
    //context.dispatch('IMPORT_FILE_SELECT', result);
    done();
}
