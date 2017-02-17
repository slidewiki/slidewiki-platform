import async from 'async';
import handleRevisionChangesAndNavigate from '../revisioning/handleRevisionChangesAndNavigate';
import DeckTreeStore from '../../stores/DeckTreeStore';
import addTreeNodeWithRevisionCheck from './addTreeNodeWithRevisionCheck';
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function addTreeNodeAndNavigate(context, payload, done) {
    log.info(context, payload);
    //load all required actions in parallel
    async.parallel([
        (callback) => {
            context.executeAction(addTreeNodeWithRevisionCheck, payload, callback);
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
            context.executeAction(handleRevisionChangesAndNavigate, {
                selector: selector,
                changeset: results[0].node.changeset,
                mode: 'edit'
            });
        }
        else {
            log.error(context, payload, {filepath: __filename, err: err});
            //context.executeAction(serviceUnavailable, payload, done);
        }

        done();
    });
}
