// import _ from 'lodash';
import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
import { isEmpty } from '../common.js';
const log = require('../configs/log').log;

// function adjustIDs(activity) {
//     activity.content_id = adjustID(activity.content_id);
//     activity.user_id = adjustID(activity.user_id);
//     if (activity.translation_info !== undefined)
//         activity.translation_info.content_id = adjustID(activity.translation_info.content_id);
//     if (activity.comment_info !== undefined)
//         activity.comment_info.comment_id = adjustID(activity.comment_info.comment_id);
//     if (activity.use_info !== undefined)
//         activity.use_info.target_id = adjustID(activity.use_info.target_id);
// }
// function adjustID(id) {
//     if (id.length === 24 && id.startsWith('1122334455')) {
//         return id.substring(20).replace(/^0+/, '');
//     }
//     return id;
// }

export default {
    name: 'activities',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;
        let selector= {'id': args.id, 'spath': args.spath, 'sid': args.sid, 'stype': args.stype, 'mode': args.mode};

        // const content_id = (!selector.sid.startsWith('1122334455')) ? ('112233445566778899000000'.substring(0, 24 - selector.sid.length) + selector.sid) : selector.sid;//TODO solve these ID issues
        const content_kind = selector.stype;
        const content_id = selector.sid;
        switch (resource) {
            case 'activities.list':

                // callback(null, {activities: initialActivities.concat(generateRandomActivities(30, 11)), selector: selector, hasMore: true});

                rp.get({uri: Microservices.activities.uri + '/activities/' + content_kind + '/' + content_id + '/more/0/30' }).then((res) => {
                    let activities = JSON.parse(res);

                    // activities.forEach((activity) => adjustIDs(activity));//TODO solve these ID issues

                    callback(null, {activities: activities, selector: selector, hasMore: (activities.length === 30)});
                }).catch((err) => {
                    console.log(err);
                    callback(null, {activities: [], selector: selector, hasMore: false});
                });

                break;
            case 'activities.more':

                if (!params.newActivities) break;
                // setTimeout(() => {
                //     let hasMoreActivities = true;
                //     let newActivities = [];
                //     const startID = params.newActivities.latestId+1;
                //     if (startID < 200) newActivities = generateRandomActivities(params.newActivities.numNew, startID);
                //     if (startID + params.newActivities.numNew > 200) hasMoreActivities = false;
                //     callback(null, {activities: newActivities, hasMore: hasMoreActivities});
                // }, 500);

                rp.get({uri: Microservices.activities.uri + '/activities/' + content_kind + '/' + content_id + '/more/' + params.newActivities.start + '/' + params.newActivities.numNew }).then((res) => {
                    let activities = JSON.parse(res);

                    // activities.forEach((activity) => adjustIDs(activity));//TODO solve these ID issues

                    callback(null, {activities: activities, selector: selector, hasMore: (activities.length === 30)});
                }).catch((err) => {
                    console.log(err);
                    callback(null, {activities: [], selector: selector, hasMore: false});
                });

                break;
        }
    },








    // create: (req, resource, params, body, config, callback) => {
    // req.reqId = req.reqId ? req.reqId : -1;
    // log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
    // let args = params.params? params.params : params;

//activity.new



    create: (activity_type, user_id, content_id, content_kind, additional_info, content_name, content_owner_id) => {
        let data = JSON.stringify({
            activity_type: activity_type,
            user_id: user_id,
            content_id: content_id,
            content_kind: content_kind
        });
        switch (activity_type) {
            case 'comment':
            case 'reply':
                data.comment_info = additional_info;
                break;
            case 'translate':
                data.translation_info = additional_info;
                break;
            case 'share':
                data.share_info = additional_info;
                break;
            case 'use':
                data.use_info = additional_info;
                break;
            case 'react':
                data.react_type = additional_info;
                break;
            case 'rate':
                data.rate_type = additional_info;
                break;
        }
        if (!co.isEmpty(contentName)) {
            data.content_name = content_name;
        }
        if (!co.isEmpty(content_owner_id)) {
            data.content_owner_id = content_owner_id;
        }

        rp.post({
            uri: Microservices.activities.uri + '/activity/new',
            body: data
        });
    },
    update: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'update', Method: req.method});
        let args = params.params? params.params : params;
        if(resource === 'activities.like'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            callback(null, {id: args.id});
        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
