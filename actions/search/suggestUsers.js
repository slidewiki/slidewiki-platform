import {shortTitle} from '../../configs/general';
import searchSyntaxError from '../error/searchSyntaxError';
import searchStringEmptyError  from '../error/searchStringEmptyError';
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function suggestUsers(context, payload, done) {

    context.service.read('suggester.users', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, payload, {filepath: __filename, err: err});
            context.executeAction(serviceUnavailable, payload, done);
        }
        done(null, res);
    });
}
