import {shortTitle} from '../../configs/general';
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function loadMoreDeckFamily(context, payload, done) {
    log.info(context);

    // form appropriate search query params
    payload.params.queryparams = `keywords=*:*&kind=deck&tag=${encodeURIComponent(payload.params.tag)}&sort=lastUpdate`;

    // fetch results from search-service
    context.service.read('searchresults.list', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
        } else {
            context.dispatch('LOAD_MORE_DECKFAMILY_DECKS', {
                tag: decodeURIComponent(payload.params.tag),
                numFound: res.numFound,
                decks: res.docs,
                start: res.start
            });
        }

        done();
    });
}
