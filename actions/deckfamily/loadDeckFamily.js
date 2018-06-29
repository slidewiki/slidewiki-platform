import {shortTitle} from '../../configs/general';
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function loadDeckFamily(context, payload, done) {
    log.info(context);

    let tagName = payload.params.tag;

    context.service.read('tags.get', { tagName }, {timeout: 20 * 1000}, (err, res) => {

        let defaultName;
        if (err) {
            defaultName = tagName;
        } else {
            defaultName = res.defaultName || tagName;
        }

         // form appropriate search query params
        payload.params.queryparams = `keywords=*:*&kind=deck&tag=${payload.params.tag}&sort=lastUpdate`;

        // fetch results from search-service
        context.service.read('searchresults.list', payload, {timeout: 20 * 1000}, (err, res) => {
            if (err) {
                log.error(context, {filepath: __filename});
                context.executeAction(serviceUnavailable, payload, done);
            } else {
                context.dispatch('LOAD_DECKFAMILY_DECKS', {
                    tag: decodeURIComponent(tagName),
                    defaultName: defaultName,
                    numFound: res.numFound,
                    decks: res.docs,
                    page: res.page, 
                    hasMore: res.hasMore
                });
            }

            let pageTitle = shortTitle + ' | Tag | ' + defaultName;
            context.dispatch('UPDATE_PAGE_TITLE', {
               pageTitle: pageTitle
            });

            done();
        });
       
    });   
}
