// import _ from 'lodash';
import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
import { isEmpty } from '../common.js';
const log = require('../configs/log').log;

export default {
    name: 'activities',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;
        let selector= {'id': args.id, 'spath': args.spath, 'sid': args.sid, 'stype': args.stype, 'mode': args.mode};

        const content_kind = selector.stype;
        const content_id = selector.sid;

        if (content_kind === undefined || content_id === undefined) {//prevent calls with invalid values
            log.error({Id: req.reqId, Selector: selector, Message: 'Invalid selector values in activities service'});
            callback(null, {activities: [], selector: selector, hasMore: false});
        } else {
            switch (resource) {
                case 'activities.list':
                    rp.get({uri: Microservices.activities.uri + '/activities/' + content_kind + '/' + content_id + '?metaonly=false&start=0&limit=30' }).then((res) => {
                        let activities = JSON.parse(res).items;
                        callback(null, {activities: activities, selector: selector, hasMore: (activities.length === 30)});
                    }).catch((err) => {
                        console.log(err);
                        callback(null, {activities: [], selector: selector, hasMore: false});
                    });

                    break;
                case 'activities.more':

                    if (!params.newActivities) break;

                    rp.get({uri: Microservices.activities.uri + '/activities/' + content_kind + '/' + content_id + '?metaonly=false&start=' + params.newActivities.start + '&limit=' + params.newActivities.numNew }).then((res) => {
                        let activities = JSON.parse(res).items;
                        callback(null, {activities: activities, selector: selector, hasMore: (activities.length === 30)});
                    }).catch((err) => {
                        console.log(err);
                        callback(null, {activities: [], selector: selector, hasMore: false});
                    });

                    break;
            }
        }
    },
    create: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;

        let headers = {};
        if (args.jwt) headers['----jwt----'] = args.jwt;

        switch (resource) {
            case 'activities.new':
                rp.post({
                    uri: Microservices.activities.uri + '/activity/new',
                    body: JSON.stringify(args.activity),
                    headers,
                }).then((res) => {
                    callback(null, {activity: JSON.parse(res)});
                }).catch((err) => {
                    console.log(err);
                    callback(err, {activity: {}});
                });
                break;
            case 'activities.newarray':
                rp.post({
                    uri: Microservices.activities.uri + '/activities/new',
                    body: JSON.stringify(args.activities),
                    headers,
                }).then((res) => {
                    callback(null, {activities: JSON.parse(res)});
                }).catch((err) => {
                    console.log(err);
                    callback(err, {activities: {}});
                });
                break;
        }
    }

    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
