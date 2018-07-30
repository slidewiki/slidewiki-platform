import async from 'async';
import DeckTreeStore from '../../stores/DeckTreeStore';
import {navigateAction} from 'fluxible-router';
import moveTreeNode from './moveTreeNode';
const log = require('../log/clog');
import Util from '../../components/common/Util';

export default function moveTreeNodeAndNavigate(context, payload, done) {
    log.info(context);
    //load all required actions in parallel
    async.parallel([
        (callback) => {
            context.executeAction(moveTreeNode, payload, callback);
        }],
        // final callback
        (err, results) => {
            if (!err) {
                let newURL;
                let {selector, sourceNode, targetNode} = payload;
                if (selector.stype === 'deck' && selector.sid === selector.id) {
                    // if we were at the root deck stay there
                    newURL = Util.makeNodeURL(selector, 'plaindeck', 'view');
                } else if (selector.stype === 'deck' && selector.sid === targetNode.get('id') && selector.spath === targetNode.get('path') && targetNode.get('children').includes(sourceNode)){
                    // if we are at the subdeck view and we move a node within *that* subdeck navigate there
                    newURL = Util.makeNodeURL({
                        id: selector.id,
                        stype: 'deck',
                        sid: targetNode.get('id'),
                        spath: targetNode.get('path')
                    }, 'deck', '');
                } else {
                    // the logic for retrieving the moved node's selector is handled in the stores
                    // therefore, we need to get access to the selector from the store
                    let newSelector = context.getStore(DeckTreeStore).getState().selector;
                    newURL =  Util.makeNodeURL({
                        id: newSelector.get('id'),
                        stype: newSelector.get('stype'),
                        sid: newSelector.get('sid'),
                        spath: newSelector.get('spath')
                    }, 'deck', '');
                }
                //navigate to new url
                context.executeAction(navigateAction, {
                    url: newURL
                });
            }
            else {
                log.error(context, {filepath: __filename});
            }
            done();
        });
}
