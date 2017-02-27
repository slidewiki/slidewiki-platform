import {shortTitle} from '../../configs/general';
import searchSyntaxError from '../error/searchSyntaxError';
import searchStringEmptyError  from '../error/searchStringEmptyError';

export default function suggestKeywords(context, payload, done) {

    context.service.read('suggester.keywords', payload, {timeout: 20 * 1000}, (err, res) => {
        done(null, res);
    });
}
