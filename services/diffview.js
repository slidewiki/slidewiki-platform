import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'diffview',
    read: (req, resource, params, config, callback) => {

        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method });
        let args = params.params ? params.params : params;
        let selector = {'stype': args.stype, 'sid': args.sid, 'baseid': args.sid.split('-')[1], 'diffid': args.did};

        if (resource === 'diffview.slide') {

            rp.get({uri: Microservices.deck.uri + '/' + selector.stype + '/' + selector.sid.split('-')[0]}).then((res) => {



                const baseSlide = JSON.parse(res).revisions.find((el) => el.id.toString() === selector.baseid);
                const diffSlide = JSON.parse(res).revisions.find((el) => el.id.toString() === selector.diffid);

                callback(null, {
                    baseSlide: baseSlide,
                    diffSlide: diffSlide
                });

            }).catch((err) => {
                console.log(err);
                callback(err);
            });
        }

    }
};
