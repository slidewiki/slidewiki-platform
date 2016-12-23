import {shortTitle} from '../../configs/general';
import searchSyntaxError from '../error/searchSyntaxError';
import searchStringEmptyError  from '../error/searchStringEmptyError';
const clog = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function suggestKeywords(context, payload, done) {

    context.service.read('suggester.keywords', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            clog.error(context, payload, {filepath: __filename, err: err});
            context.executeAction(serviceUnavailable, payload, done);
        }
        done(null, res);
    });
}
