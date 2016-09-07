import {Microservices} from '../configs/microservices';
import rp from 'request-promise';

//extracts the id of the immediate parent deck from the path string
function findImmediateParentId(selector) {
    let arr = selector.spath.split(';');
    //root deck is parent
    if (arr.length <= 1) {
        return selector.id;
    } else {
        arr.splice(-1, 1);
        return arr[arr.length - 1].split(':')[0];
    }
}

//extracts the position from path string
function getRelPositionFromPath(spath) {
    let arr = spath.split(';');
    return arr[arr.length - 1].split(':')[1];
}

export default {
    name: 'history',

    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params ? params.params : params;
        let selector = {'id': args.id, 'spath': args.spath, 'sid': args.sid, 'stype': args.stype, 'mode': args.mode};
        let isRootDeck = selector.stype === 'deck' && selector.id === selector.sid;
        if (resource === 'history.list') {
            let history, contentItemPromise, parentPromise;
            let immediateParentId = findImmediateParentId(selector);
            if (!isRootDeck) {
                //if the specified node is not the root deck, we need to request for its immediate parent in order to find the active revision
                parentPromise = rp.get({uri: Microservices.deck.uri + '/deck/' + immediateParentId}).promise().bind(this);
            }
            contentItemPromise = rp.get({uri: Microservices.deck.uri + '/' + selector.stype + '/' + selector.sid.split('-')[0]}).promise().bind(this);

            //do the requests in parallel
            Promise.all([parentPromise, contentItemPromise]).then((res) => {
                let contentItem = JSON.parse(res[1]), revisions = contentItem.revisions, parentDeck;
                let activeRevisionId;
                if (isRootDeck) {
                    activeRevisionId = contentItem.active;
                }
                else {
                    parentDeck = JSON.parse(res[0]);
                    //we asked for a specific revision of the parent deck so its revisions array should contain just one item
                    activeRevisionId = parentDeck.revisions[0].contentItems[getRelPositionFromPath(selector.spath) - 1].ref.revision;
                }
                let activeRevision = revisions.find((revision) => revision.id === activeRevisionId);
                if (activeRevision) {
                    activeRevision.active = true;
                }
                //mock-up usernames
                let users = ['Valentina J.', 'Marko B.', 'SlideWiki FTW'];
                //fill in every revision with dummy username
                revisions.forEach((revision) => {
                    revision.username = users[(parseInt(revision.user) || 0) % users.length];
                });
                callback(null, {
                    //reverse revisions array so that it is sorted by date descending
                    history: revisions.reverse(),
                    selector: selector
                });
            }).catch((err) => {
                console.log(err);
                callback(null, {history: {}, selector: selector});
            });
        }
    },

    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    update: (req, resource, params, body, config, callback) => {
        let args = params.params ? params.params : params;
        if (resource === 'history.revert') {
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            callback(null, {id: args.id});
        }
    }
    // delete: (req, resource, params, config, callback) => {}
};
