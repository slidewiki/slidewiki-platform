import {navigateAction} from 'fluxible-router';
import UserProfileStore from '../../stores/UserProfileStore';
import checkNewRevisionNeeded from './checkNewRevisionNeeded';
import saveTreeNode from './saveTreeNode';
import serviceUnavailable from '../error/serviceUnavailable';
import undoRenameTreeNode from './undoRenameTreeNode';


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
                console.log('From saveTreeNodeWithRevisionCheck.js:', err);
                context.executeAction(serviceUnavailable, payload, done);
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
                        context.executeAction(undoRenameTreeNode, payload.selector, done);
                    });
                } else {
                    context.executeAction(saveTreeNode, payload, done);
                }
            }
        });
    }
}
