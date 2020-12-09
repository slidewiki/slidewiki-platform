import rp from 'request-promise';
import { Microservices } from '../configs/microservices';
const log = require('../configs/log').log;

export default {
    name: 'questionAnswering',
    read: (req, resource, params, config, callback) => {
        log.info({ Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method });
        let args = params.params ? params.params : params;

        rp.get({ uri: Microservices.questionAnswering.uri + '/api/question/answer?query=' + args.question })
            .then((res) => {
                const answers = JSON.parse(res);
                callback(null, { answers });
            })
            .catch((err) => callback(err));
    },
};
