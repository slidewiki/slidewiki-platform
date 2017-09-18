import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
import { isEmpty } from '../common.js';
const log = require('../configs/log').log;

export default {
    name: 'like',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;
        let selector= {'id': args.id, 'spath': args.spath, 'sid': args.sid, 'stype': args.stype, 'mode': args.mode};
        let targetDeckID;

        const content_kind = selector.stype;
        const content_id = selector.sid;
        switch (resource) {
            case 'like.loadLikes':
                if (params.selector.stype === 'deck') {
                    targetDeckID = params.selector.sid;
                } else if (params.selector.stype === 'slide') {
                    let tmp = params.selector.spath.split(';');
                    if (tmp.length > 1) {
                        targetDeckID = tmp[tmp.length - 2];
                        tmp = targetDeckID.split(':');
                        targetDeckID = tmp[0];
                    } else {
                        targetDeckID = params.selector.id;
                    }
                }
                //console.log("LOAD Deck id: " + targetDeckID);
                  /*********connect to microservices*************/
                rp.get({uri: Microservices.activities.uri + '/activities/deck/' + targetDeckID + '?metaonly=false&activity_type=react&all_revisions=true'}).then((res) => {
                    let activities = JSON.parse(res);
                    let listOfUserIDs = [];

                    activities.forEach((activity) => listOfUserIDs.push(activity.user_id));

                    callback(null, {usersWhoLikedDeck: listOfUserIDs});
                }).catch((err) => {
                    console.log(err);
                    callback(null, {usersWhoLikedDeck: []});
                });
                //callback(null, {usersWhoLikedDeck: [1, 2, 3, 4, 5]});
                break;
        }
    },

    create: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;
        let targetDeckID;

        switch (resource) {
            case 'like.likeActivity':
                if (params.selector.stype === 'deck') {
                    targetDeckID = params.selector.sid;
                } else if (params.selector.stype === 'slide') {
                    let tmp = params.selector.spath.split(';');
                    if (tmp.length > 1) {
                        targetDeckID = tmp[tmp.length - 2];
                        tmp = targetDeckID.split(':');
                        targetDeckID = tmp[0];
                    } else {
                        targetDeckID = params.selector.id;
                    }
                }
                //console.log("LIKE Deck id: " + targetDeckID + "  User id: " + params.userid);
                /*********connect to microservices*************/
                //update backend store
                rp.post({
                    uri: Microservices.activities.uri + '/activity/new',
                    body:JSON.stringify({
                        activity_type: 'react',
                        user_id: String(params.userid),
                        content_id: String(targetDeckID),
                        content_kind: 'deck',
                        react_type: 'like'
                    })
                }).then((res) => {
                    callback(null, {userid:  String(params.userid), username: params.username, selector: args.selector});
                }).catch((err) => {
                    console.log(err);
                    callback(null, {userid:  null});
                });
                //callback(null, {userid:  params.userid});
                break;
            case 'like.dislikeActivity':
                if (params.selector.stype === 'deck') {
                    targetDeckID = params.selector.sid;
                } else if (params.selector.stype === 'slide') {
                    let tmp = params.selector.spath.split(';');
                    if (tmp.length > 1) {
                        targetDeckID = tmp[tmp.length - 2];
                        tmp = targetDeckID.split(':');
                        targetDeckID = tmp[0];
                    } else {
                        targetDeckID = params.selector.id;
                    }
                }
                //console.log("DISLIKE Deck id: " + targetDeckID + "  User id: " + params.userid);
                /*********connect to microservices*************/
                //update (remove id) backend store
                let options = {
                    method: 'DELETE',
                    uri: Microservices.activities.uri + '/activities/delete',
                    body:JSON.stringify({
                        content_kind: 'deck',
                        content_id: String(targetDeckID),
                        activity_type: 'react',
                        user_id: String(params.userid),
                        all_revisions: true
                    })
                };
                rp(options).then((res) => {
                    callback(null, {userid:  String(params.userid), selector: args.selector});
                }).catch((err) => {
                    console.log(err);
                    callback(null, {userid:  null});
                });
                //callback(null, {userid: params.userid});
                break;
        }
    }
};
