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
        let args = {
            query: {
                keywords: `tags:"${payload.params.tag}" OR topics:"${payload.params.tag}"`,
                sort: 'lastUpdate',
                facets: false,
                expand: false,
                spellcheck: false,
            }
        };

        // fetch results from search-service
        context.service.read('searchresults.list', args, {timeout: 20 * 1000}, (err, res) => {
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
                    hasMore: res.hasMore,
                    links: res.links,
                });
                done();
            }

            let pageTitle = shortTitle + ' | Tag | ' + defaultName;
            context.dispatch('UPDATE_PAGE_TITLE', {
                pageTitle: pageTitle
            });
        });
    });   
}
