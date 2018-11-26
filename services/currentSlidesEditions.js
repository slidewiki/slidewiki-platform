import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'currentSlidesEditions',

    read: (req, resource, slideId, config, callback) => {

        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});

        switch (resource) {
            case 'currentSlidesEditions.slide':
                rp.get({uri: Microservices.activities.uri + '/slideEdition/slide/' + slideId}).then((res) => {
                    let slideEditions = JSON.parse(res);
                    callback(null, {slideEditions: slideEditions});
                }).catch((err) => {
                    console.log(err);
                    callback(null, {followings: []});
                });
                break;
        }

    }
}
