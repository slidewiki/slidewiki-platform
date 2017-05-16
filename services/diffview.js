import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'diffview',
    read: (req, resource, params, config, callback) => {

        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method });
        let args = params.params ? params.params : params;
        let selector = {'stype': args.stype, 'sid': args.sid, 'diffid': args.did};

        if (resource === 'diffview.slide') {

            rp.get({uri: Microservices.deck.uri + '/' + selector.stype + '/' + selector.sid.split('-')[0]}).then((res) => {

                // console.log(res);

                callback(null, {
                    history: res,
                    selector: selector
                });

            }).catch((err) => {
                console.log(err);
                callback(err);
            });
        }

    }
};
