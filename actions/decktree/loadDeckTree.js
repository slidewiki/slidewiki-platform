import {shortTitle} from '../../configs/general';
import DeckTreeStore from '../../stores/DeckTreeStore';
import serviceUnavailable from '../error/serviceUnavailable';
import deckIdTypeError from '../error/deckIdTypeError';
import deckContentPathError from '../error/deckContentPathError';
import {AllowedPattern} from '../error/util/allowedPattern';
import UserProfileStore from '../../stores/UserProfileStore';
import TranslationStore from '../../stores/TranslationStore';
const log = require('../log/clog');
import Util from '../../components/common/Util';
import {navigateAction} from 'fluxible-router';

export default function loadDeckTree(context, payload, done) {
    log.info(context);
    if (!(AllowedPattern.DECK_ID.test(payload.params.id))) {
        context.executeAction(deckIdTypeError, payload, done);
        return;
    }

    if (!(payload.params.spath && (AllowedPattern.DECK_CONTENT_PATH.test(payload.params.spath)) || payload.params.spath === undefined || payload.params.spath === '')) {
        context.executeAction(deckContentPathError, payload, done);
        return;
    }
    let pageTitle = shortTitle + ' | Deck Tree | ' + payload.params.id;

    let currentSelector = context.getStore(DeckTreeStore).getSelector();

    let runFetchTree = 1;

    //runFetchTree flag may be passed through the navigate action to force deck tree fetch
    // if (!payload.navigate.runFetchTree && currentSelector.id === payload.params.id) {
    //     runFetchTree = 0;
    // }
    // console.log('loadDeckTree runFetchTree', runFetchTree);
    if (runFetchTree) {
        //we need to load the whole tree for the first time
        payload.params.jwt = context.getStore(UserProfileStore).jwt;
        payload.params.language = context.getStore(TranslationStore).currentLang || context.getStore(TranslationStore).originLanguage;
        context.service.read('decktree.nodes', payload, {timeout: 20 * 1000}, (err, res) => {
            if (err) {
                log.error(context, {filepath: __filename});
                context.executeAction(serviceUnavailable, payload, done);
            } else {
                context.dispatch('LOAD_DECK_TREE_SUCCESS', res);
                //context.dispatch('UPDATE_PAGE_TITLE', {
                //    pageTitle: pageTitle
                //});

                if (payload.instantNavigation) {
                    let pathElements = res.selector.spath.split(';');
                    let pathDepth = pathElements.length;
                    let currentDepth = 1;
                    function getVariantChild(children) {
                        if (currentDepth < pathDepth) {
                            let deckid = pathElements[currentDepth-1].split(':')[0];
                            let newChilds = children.find((c) => c.id === deckid && c.type === 'deck').children;
                            currentDepth++;
                            console.log('getVariantChild going into next depth', currentDepth, 'with deckid', deckid);
                            return getVariantChild(newChilds);
                        }

                        let slideid = pathElements[currentDepth-1].split(':')[0];
                        let position = parseInt(pathElements[currentDepth-1].split(':')[1]);
                        let slide = children[position-1];
                        // console.log('getVariantChild got slideid', slideid, ', position', position, ' and slide', slide);
                        return (slide.id === slideid) ? undefined : slide;
                    }
                    let newChild = getVariantChild(res.deckTree.children);
                    if (newChild) {
                        let position = parseInt(pathElements[currentDepth-1].split(':')[1]);
                        pathElements[currentDepth-1] = newChild.id + ':' + position;
                        res.selector.spath = pathElements.join(';');
                        res.selector.sid = newChild.id;
                        // console.log('getVariantChild new selector', res.selector);

                        let nodeURL = Util.makeNodeURL(res.selector, 'deck', res.mode, '', payload.params.language);
                        location.href = location.origin + nodeURL;
                    }
                    else {
                        let languageCodeIndex = location.search.indexOf('language=') + 9;
                        if (languageCodeIndex === 8) {
                            location.search = location.search + '&language=' + payload.params.language;
                        }
                        else {
                            let endLanguageCodeIndex = location.search.substring(languageCodeIndex).indexOf('&');
                            let code = location.search.substring(languageCodeIndex + 9, endLanguageCodeIndex === -1 ? location.search.length : languageCodeIndex + endLanguageCodeIndex);
                            if (code !== payload.params.language) {
                                location.search = location.search.substring(languageCodeIndex + 9) + payload.params.language + (endLanguageCodeIndex === -1) ? '' : location.search.substring(languageCodeIndex + endLanguageCodeIndex);
                            }
                        }
                    }
                }

                done();
            }
        });
    } else {
        //when we only select the node in tree, there is no need to call the external service
        context.dispatch('SELECT_TREE_NODE_SUCCESS', payload.params);
        //context.dispatch('UPDATE_PAGE_TITLE', {
        //    pageTitle: pageTitle
        //});
        done();
    }
}
