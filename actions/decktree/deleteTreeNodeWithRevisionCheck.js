import {navigateAction} from 'fluxible-router';
import UserProfileStore from '../../stores/UserProfileStore';
import checkNewRevisionNeeded from './checkNewRevisionNeeded';
import deleteTreeNode from './deleteTreeNode';
import serviceUnavailable from '../error/serviceUnavailable';
import { logger, breadcrumb} from '../../configs/log';

export default function deleteTreeNodeWithRevisionCheck(context, payload, done) {
    logger.info({reqId: payload.navigate.reqId, navStack: context.stack});
    let userid = context.getStore(UserProfileStore).userid;
    let args = payload.params ? payload.params : payload;
    let selector = {'id': String(args.id), 'spath': args.spath, 'sid': String(args.sid), 'stype': args.stype};
    if (userid != null && userid !== '') {
        //enrich with user id
        payload.userid = userid;
        context.executeAction(checkNewRevisionNeeded, {
            selector: selector,
            userid: userid
        }, (err, res) => {
            if (err) {
                logger.error({reqId: payload.navigate.reqId, err: err});
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
                        context.executeAction(deleteTreeNode, payload, done);
                    }, (reason) => {
                        done(reason);
                    });
                } else {
                    swal({
                        title: 'Confirmation',
                        text: 'Do you want to delete this slide?',
                        type: 'question',
                        showCloseButton: true,
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        confirmButtonClass: 'ui olive button',
                        cancelButtonText: 'No',
                        cancelButtonClass: 'ui red button',
                        buttonsStyling: false
                    }).then((accepted) => {
                        context.executeAction(deleteTreeNode, payload, done);
                    }, (reason) => {
                        done(reason);
                    });
                }
            }
        });
    }
}
