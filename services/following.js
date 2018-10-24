// import _ from 'lodash';
import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'following',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;
        let userId = args.userId;

        switch (resource) {
            case 'following.deck':
                let selector= args.selector;
                const content_kind = selector.stype;
                let targetDeckID;
                if (selector.stype === 'deck') {
                    targetDeckID = selector.sid;
                } else if (selector.stype === 'slide') {
                    let tmp = selector.spath.split(';');
                    if (tmp.length > 1) {
                        targetDeckID = tmp[tmp.length - 2];
                        tmp = targetDeckID.split(':');
                        targetDeckID = tmp[0];
                    } else {
                        targetDeckID = selector.id;
                    }
                }
                targetDeckID =  targetDeckID.split('-')[0];

                rp.get({uri: Microservices.activities.uri + '/followings/follower/' + userId + '?followed_type=deck&followed_id=' + targetDeckID }).then((res) => {
                    let followings = JSON.parse(res);
                    callback(null, {followings: followings});
                }).catch((err) => {
                    console.log(err);
                    callback(null, {followings: []});
                });
                break;
            case 'following.playlist':
                const playlistId = args.playlistId;
                rp.get({uri: Microservices.activities.uri + '/followings/follower/' + userId + '?followed_type=playlist&followed_id=' + playlistId }).then((res) => {
                    let followings = JSON.parse(res);
                    callback(null, {followings: followings});
                }).catch((err) => {
                    console.log(err);
                    callback(null, {followings: []});
                });
                break;
            case 'following.all':
                rp.get({uri: Microservices.activities.uri + '/followings/follower/' + userId }).then((res) => {
                    let followings = JSON.parse(res);

                    //GET TITLES FOR DECKS AND PLAYLISTS
                    if (followings.length === 0) {
                        callback(null, []);
                    } else {
                        //GET DATA FOR DECKS FROM DECK SERVICE
                        let deckPromises = [];
                        let playlistPromises = [];

                        for(let following of followings){
                            if (following.followed_type === 'deck') {
                                let deckId = following.followed_id;
                                deckPromises.push(
                                    rp.get({
                                        uri: `${Microservices.deck.uri}/deck/${deckId}`,
                                        json: true
                                    })
                                );
                            } else if (following.followed_type === 'playlist') {
                                let playlistId = following.followed_id;
                                playlistPromises.push(
                                    rp.get({
                                        uri: `${Microservices.deck.uri}/group/${playlistId}`,
                                        json: true
                                    })
                                );
                            }
                        }

                        let deckPromise = Promise.all(deckPromises);
                        let playlistPromise = Promise.all(playlistPromises);

                        Promise.all([deckPromise, playlistPromise]).then( (data) => {
                            let decks = data[0];
                            let playlists = data[1];
                            let users = [];
                            decks.forEach((deck) => {
                                let index = followings.findIndex((following) => {return (following.followed_id === String(deck._id));});
                                if (index !== -1) {
                                    let activeRevision = deck.revisions[deck.revisions.length-1];
                                    followings[index].title = activeRevision.title;
                                    followings[index].description = deck.description;
                                    followings[index].userId = deck.user;
                                    users.push(deck.user);
                                }
                            });
                            playlists.forEach((playlist) => {
                                let index = followings.findIndex((following) => {return (following.followed_id === String(playlist._id));});
                                if (index !== -1) {
                                    followings[index].title = playlist.title;
                                    followings[index].description = playlist.description;
                                    followings[index].decksLength = playlist.decks.length;
                                    followings[index].userId = playlist.user;
                                    // users.push(playlist.user);
                                }
                            });
                            if (users.length === 0) {
                                callback(null, {followings: followings});
                            } else {
                                let userData = JSON.stringify(users);
                                rp.post({uri: Microservices.user.uri + '/users', body: userData}).then((res) => {
                                    let userDataArray = JSON.parse(res);
                                    userDataArray.forEach((userData) => {
                                        let userId = userData._id;
                                        let username = userData.username;
                                        let displayName = userData.displayName;
                                        followings.forEach((following) => {
                                            if (following.userId === userId) {
                                                following.userName = username;
                                                following.displayName = displayName;
                                            }
                                        });
                                    });

                                    callback(null, {followings: followings});
                                }).catch( (err) => {
                                    console.log(err);
                                    callback(null, []);
                                });
                            }
                        }).catch( (err) => {
                            console.log(err);
                            callback(null, []);
                        });
                    }
                }).catch((err) => {
                    console.log(err);
                    callback(null, {followings: []});
                });
                break;
        }
    },
    create: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;
        let selector= args.selector;
        let userId = args.userId;
        let targetDeckID;
        let headers = {};
        if (args.jwt) headers['----jwt----'] = args.jwt;
        switch (resource) {
            case 'following.deck':
                if (selector.stype === 'deck') {
                    targetDeckID = selector.sid;
                } else if (selector.stype === 'slide') {
                    let tmp = selector.spath.split(';');
                    if (tmp.length > 1) {
                        targetDeckID = tmp[tmp.length - 2];
                        tmp = targetDeckID.split(':');
                        targetDeckID = tmp[0];
                    } else {
                        targetDeckID = selector.id;
                    }
                }
                targetDeckID =  targetDeckID.split('-')[0];

                rp.post({
                    uri: Microservices.activities.uri + '/followings/new',
                    body:JSON.stringify({
                        user_id: String(userId),
                        followed_type: 'deck',
                        followed_id: String(targetDeckID)
                    }),
                    headers,
                }).then((res) => {
                    callback(null, JSON.parse(res));
                }).catch((err) => {
                    console.log(err);
                    callback(err, params);
                });
                break;
            case 'following.playlist':
                rp.post({
                    uri: Microservices.activities.uri + '/followings/new',
                    body:JSON.stringify({
                        user_id: String(userId),
                        followed_type: 'playlist',
                        followed_id: String(args.playlistId)
                    }),
                    headers,
                }).then((res) => {
                    callback(null, JSON.parse(res));
                }).catch((err) => {
                    console.log(err);
                    callback(err, params);
                });
                break;
        }
    },
    delete: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'delete', Method: req.method});
        let args = params.params? params.params : params;

        if (resource === 'following.item'){
            /*********connect to microservices*************/
            const id = args.id;
            let options = {
                method: 'DELETE',
                uri: Microservices.activities.uri + '/followings/delete',
                body:JSON.stringify({
                    id: id
                })
            };
            rp(options).then(() => {
                callback(null, {id: id});
            }).catch((err) => {
                console.log(err);
                callback(err, params);
            });
        }
    },

    // other methods
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
