import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'slidesCurrentlyEdited',

    read: (req, resource, payload, config, callback) => {

        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});

        switch (resource) {

            case 'slidesCurrentlyEdited.slide':


                rp.get({uri: Microservices.activities.uri + '/slideCurrentlyEdited/slide/' + payload.sid}).then((res) => {
                    let slidesCurrentlyEdited = JSON.parse(res);
                    callback(null, {slidesCurrentlyEdited: slidesCurrentlyEdited});
                }).catch((err) => {
                    callback(err, null);
                });
                break;
        }

    },

    create: (req, resource, payload, config, emptyObject, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'create', Method: req.method});

        let jwt = payload.jwt;

        delete payload.jwt;

        if (resource === 'slidesCurrentlyEdited.slide') {

            /*********connect to microservices*************/
            rp.post({
                uri: Microservices.activities.uri + '/slideCurrentlyEdited/new',
                headers: {'----jwt----': jwt},
                body:JSON.stringify(payload)
            }).then((res) => {
                // console.log(JSON.parse(res));
                callback(null, {slideCurrentlyEdited: res});
            }).catch((err) => {
                // console.log(err);
                callback(err, null);
            });

        }
    }

    delete: (req, resource, payload, config, emptyObject, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'create', Method: req.method});

        let jwt = payload.jwt;
        delete payload.jwt;

        if (resource === 'slidesCurrentlyEdited.deleteEvent') {

            /*********connect to microservices*************/
            /*rp.delete({
                uri: Microservices.activities.uri + '/slideCurrentlyEdited/new',
                headers: {'----jwt----': jwt},
                body:JSON.stringify(payload)
            }).then((res) => {
                // console.log(JSON.parse(res));
                callback(null, {slideCurrentlyEdited: res});
            }).catch((err) => {
                // console.log(err);
                callback(err, null);
            });
        */
        }


    }
};
