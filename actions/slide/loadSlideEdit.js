import {shortTitle} from '../../configs/general';
import slideIdTypeError from '../error/slideIdTypeError';
import { AllowedPattern } from '../error/util/allowedPattern';
import expandContentPanel from '../deckpagelayout/expandContentPanel';
import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

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
        let pageTitle = shortTitle + ' | Slide Edit | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
