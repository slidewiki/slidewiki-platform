import {shortTitle} from '../configs/general';
import slideIdTypeError from './error/slideIdTypeError';
import serviceUnavailable from './error/serviceUnavailable';
import { AllowedPattern } from './error/util/allowedPattern';
const log = require('./log/clog');
import TranslationStore from '../stores/TranslationStore';

export default function loadDeckView(context, payload, done) {
    log.info(context);
    if (!(AllowedPattern.SLIDE_ID.test(payload.params.sid) || payload.params.sid === undefined)) {
        context.executeAction(slideIdTypeError, payload, done);
        return;
    }

    payload.params.language = context.getStore(TranslationStore).currentLang || context.getStore(TranslationStore).treeLanguage;

    context.service.read('deck.content', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename, message: err.message });
            context.executeAction(serviceUnavailable, payload, done);
            return;
        } else {
            // console.log('loadDeckView params', payload.params, '\n', payload);
            res.isRootDeck = payload.params.spath === '';
            context.dispatch('LOAD_DECK_CONTENT_SUCCESS', res);
            context.dispatch('LOAD_DECK_METADATA_SUCCESS', {
                thumbnailID: res.slidesData.children[0].id, 
                thumbnailTheme: res.slidesData.theme,
                description: res.deckData.description
            });
        }

        let pageTitle = res.slidesData.title;
        
        if (payload.page && payload.page === 'decklandingpage') {
            pageTitle = shortTitle + ' | Presentation information | ' + pageTitle;
        } else if (payload.page && payload.page === 'deck') {
            pageTitle = shortTitle + ' | Presentation overview | ' + pageTitle;
        } else {
            pageTitle = shortTitle + ' | ' + pageTitle;
        }
        console.log('context', context.intl);
        let cleanTitle = pageTitle.replace(/<\/?[^>]+(>|$)/g, '').replace(/&#39;/g, '\'').replace(/&#34;/g, '\"');

        /*context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: cleanTitle,
        //    frozen: true,
        //    allowUnfreeze: true,
        });*/
        done();
    });
}
