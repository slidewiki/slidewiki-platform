import {navigateAction} from 'fluxible-router';
import UserProfileStore from '../../stores/UserProfileStore';
import checkNewRevisionNeeded from './checkNewRevisionNeeded';
import saveTreeNode from './saveTreeNode';

export default function saveTreeNodeWithRevisionCheck(context, payload, done) {
    let userid = context.getStore(UserProfileStore).userid;
    if (userid != null && userid !== '') {
        //enrich with user id
        payload.userid = userid;
        context.executeAction(checkNewRevisionNeeded, {
            selector: payload.selector,
            userid: userid
        }, (err, res) => {
            if (err) {

            } else {
                if (res.status.needs_revision) {
                    swal({
                        title: 'New Revision Alert',
                        text: 'This action will create new revisions for slide deck(s). Do you agree with creating the new revisions?',
                        type: 'question',
                        showCloseButton: true,
                        showCancelButton: true,
                        confirmButtonText: 'Yes, make new revisions',
                        confirmButtonClass: 'ui olive button',
                        cancelButtonText: 'No',
                        cancelButtonClass: 'ui red button',
                        buttonsStyling: false
                    }).then((accepted) => {
                        context.executeAction(saveTreeNode, payload, done);
                    }, (reason) => {
                        context.dispatch('UNDO_RENAME_TREE_NODE_SUCCESS', payload.selector);
                    });
                } else {
                    context.executeAction(saveTreeNode, payload, done);
                }
            }
        });
    }
}
