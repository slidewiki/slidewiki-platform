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

            //callback to execute when both requests are successful
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
                let userIdsHash = {};
                revisions.forEach((revision) => {
                    if (revision.user != null) {
                        userIdsHash[parseInt(revision.user)] = true;
                    }
                });
                let userId, userPromises = [], userNames = {};
                //todo use a single request if getMultipleUsers is added to user service
                for (userId in userIdsHash) {
                    userPromises.push(rp.get({uri: Microservices.user.uri + '/user/' + userId}).then((userRes) => {
                        let user = JSON.parse(userRes);
                        userNames[user._id] = user.username;
                    }));
                }
                //when all user data are fetched
                Promise.all(userPromises).then().catch((err) => {
                    console.log(err);
                }).then(() => {
                    // behaves like finally. called when all user requests are complete regardless of their success status
                    //todo do this in the first then callback. just a temporary fix because of dummy user ids in database
                    //enrich every revision with username
                    revisions.forEach((revision) => {
                        let userName = userNames[revision.user];
                        if (userName == null || userName === '') {
                            userName = 'Unknown user';
                        }
                        revision.username = userName;
                    });
                    callback(null, {
                        //reverse revisions array so that it is sorted by date descending
                        history: revisions.reverse(),
                        selector: selector
                    });
                });
            }).catch((err) => {
                console.log(err);
                callback(err);
            });
        }
    },
    update: (req, resource, params, body, config, callback) => {
        let args = params.params ? params.params : params;
        let selector = {
            'id': args.selector.id,
            'spath': args.selector.spath,
            'sid': String(args.selector.sid),
            'stype': args.selector.stype
        };
        if (resource === 'history.revert') {
            let immediateParentId = findImmediateParentId(selector);
            console.log({
                revision_id: String(args.revisionId),
                root_deck: immediateParentId
            });
            rp.post({
                uri: Microservices.deck.uri + '/' + selector.stype + '/revert/' + selector.sid.split('-')[0],
                body: JSON.stringify({
                    revision_id: String(args.revisionId),
                    root_deck: immediateParentId
                })
            }).then((slide) => {
                callback(null, slide);
            }).catch((err) => {
                callback(err, {
                    error: err
                });
            });
        }
    }
};
