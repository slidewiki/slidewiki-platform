import async from 'async';
import DeckTreeStore from '../../stores/DeckTreeStore';
import deleteTreeNode from './deleteTreeNode';
const log = require('../log/clog');
import {
    navigateAction
} from 'fluxible-router';
import Util from '../../components/common/Util';
import serviceUnavailable from '../error/serviceUnavailable';

export default function deleteTreeNodeAndNavigate(context, payload, done) {
    log.info(context);

    let callback = (accepted) => {
        //load all required actions in parallel
        async.parallel([
            (callback) => {
                context.executeAction(deleteTreeNode, payload, callback);
            }
        ],
            // final callback
            (err, results) => {
                if (!err) {
                    //the logic for retrieving the parent node is handles in the stores
                    //therefore, we need to get access to the selector from the store
                    let currentState = context.getStore(DeckTreeStore).getState();
                    let selector = {
                        id: currentState.selector.get('id'),
                        stype: currentState.selector.get('stype'),
                        sid: currentState.selector.get('sid'),
                        spath: currentState.selector.get('spath')
                    };
                    context.executeAction(navigateAction, {
                        url: Util.makeNodeURL(selector, 'deck', 'view', undefined, undefined, true)
                    });
                } else {
                    log.error(context, {
                        filepath: __filename
                    });
                    //context.executeAction(serviceUnavailable, payload, done);
                }
                done();
            });
    };

    // skip swal as a previous modal already got approval
    console.log(payload);
    if (payload.confirmed) {
        return callback(true);
    }

    let elementTitle = payload.stype, html;
    if (elementTitle === 'deck') {
        elementTitle = 'subdeck';
        html = 'You will still be able to find this deck "My Decks" after removing it. You can only delete non-shared subdecks that have no subdecks of their own.';
    }
    swal({
        title: 'Remove ' + elementTitle + '. Are you sure?',
        html,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, remove it!'

    }).then(callback, (reason) => { /*do nothing*/ }).catch(swal.noop);
}
