import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'analytics',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;
        let uid = args.uid;
        if (uid === undefined) {
            uid = 0;
        }
        if (resource === 'analytics.predictionslist'){


            const analyticsServiceUri = 'http://localhost:8084';

            rp.get({uri: analyticsServiceUri + '/analytics/webresources/predictionjob/' + uid, proxy: '' }).then((res) => {




                let predictions = JSON.parse(res);


                callback(null, {predictions: predictions});

            }).catch((err) => {
                console.log(err);
                callback(null, {predictions: []});
            });
        }
    }

    // other methods
    // create: (req, resource, params, body, config, callback) => {},

};
