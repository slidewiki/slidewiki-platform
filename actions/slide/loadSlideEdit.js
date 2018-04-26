import {shortTitle} from '../../configs/general';
import slideIdTypeError from '../error/slideIdTypeError';
import { AllowedPattern } from '../error/util/allowedPattern';
import expandContentPanel from '../deckpagelayout/expandContentPanel';
import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');
import DeckTreeStore from '../../stores/DeckTreeStore'; 

export default function loadSlideEdit(context, payload, done) {
    if (!(AllowedPattern.SLIDE_ID.test(payload.params.sid) || payload.params.sid === undefined)) {
        context.executeAction(slideIdTypeError, payload, done);
        return;
    }

    context.service.read('slide.content', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('LOAD_SLIDE_EDIT_FAILURE', err);
        } else {
            //expand edit view collapsing TreeNode. Then dispatch LOAD_SLIDE_EDIT_SUCCESS
            //revert for SWIK-1347 - Slide Edit view to display decktree (and right-hand panel)
            //context.executeAction(expandContentPanel,{}, () => {
            context.dispatch('LOAD_SLIDE_EDIT_SUCCESS', res);
            //});

            //TODO: do not allow editing title when on the edit slide mode
            //context.dispatch('UNDO_RENAME_TREE_NODE_SUCCESS', payload.params);
        }


        let deckTitle = context.getStore(DeckTreeStore).getState().deckTree.get('title');
        let pageTitle = shortTitle + ' | ' + deckTitle + ' | ' + res.slide.revisions[0].title + ' | ' + 'edit';

        // remove HTML tags and quotation marks from the title
        let cleanTitle = pageTitle.replace(/<\/?[^>]+(>|$)/g, '').replace(/&#39;/g, '\'').replace(/&#34;/g, '\"');
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: cleanTitle,
        });
        // I have absolutely no idea why, but without this fake dispatch,
        // going from view to edit mode messes with the UI
        //context.dispatch('');
        //Klaas edit; this introduces an error
        done();
    });
}
