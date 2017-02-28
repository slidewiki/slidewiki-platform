import {shortTitle} from '../../configs/general';
import searchSyntaxError from '../error/searchSyntaxError';
import searchStringEmptyError  from '../error/searchStringEmptyError';

export default function suggestUsers(context, payload, done) {

    context.service.read('suggester.users', payload, {timeout: 20 * 1000}, (err, res) => {
        done(null, res);
    });
}
