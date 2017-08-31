import { Microservices } from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'userreview',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params ? params.params : params;
        let secret = args.secret;

        if (resource === 'userreview.nextreviewable') {
            rp.get({uri: Microservices.user.uri + '/reviewqueue?secret=' + secret, headers: {'----jwt----': args.jwt }}).then((res) => {
                let user = JSON.parse(res);
                callback(null, {user: user, secret: secret, secretCorrect: true});
            }).catch((err) => {
                callback(err, {});
            });
        }
    },
    create: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params ? params.params : params;
        let secret = args.secret;

        if (resource === 'userreview.keepreviewing') {
            rp.post({uri: Microservices.user.uri + '/reviewqueue/' + args.userid + '?secret=' + secret, headers: {'----jwt----': args.jwt }}).then((res) => {
                callback(null, JSON.parse(res));
            }).catch((err) => {
                console.log(err.StatusCodeError, err.message, err.options);
                callback(err, {});
            });
        }
    },
    update: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params ? params.params : params;
        let secret = args.secret;

        if (resource === 'userreview.approve') {
            rp.patch({uri: Microservices.user.uri + '/user/' + args.userid + '/approve?secret=' + secret, headers: {'----jwt----': args.jwt }}).then((res) => {
                callback(null, JSON.parse(res));
            }).catch((err) => {
                console.log(err.StatusCodeError, err.message, err.options);
                callback(err, {});
            });
        } else if (resource === 'userreview.suspend') {
            rp.post({uri: Microservices.user.uri + '/user/' + args.userid + '/suspend?secret=' + secret, headers: {'----jwt----': args.jwt }}).then((res) => {
                callback(null, JSON.parse(res));
            }).catch((err) => {
                console.log(err.StatusCodeError, err.message, err.options);
                callback(err, {});
            });
        }
    }
};
