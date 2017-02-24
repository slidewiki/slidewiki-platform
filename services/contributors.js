import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'contributors',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params ? params.params : params;
        let selector = {'sid': args.sid, 'stype': args.stype, 'spath': args.spath};
        if (resource === 'contributors.list') {
            //request specific content item from deck service
            rp.get({uri: Microservices.deck.uri + '/' + selector.stype + '/' + selector.sid}).then((res) => {
                let parsedRes = JSON.parse(res);
                let userPromises = parsedRes.contributors.map((contributor) => {
                    return rp.get({uri: Microservices.user.uri + '/user/' + contributor.user});
                });
                //when all user data is fetched successfully return from service
                Promise.all(userPromises).then((responses) => {
                    let contributors = responses.map((res) => {
                        let user = JSON.parse(res);
                        user.id = user._id;
                        //if user is the creator of an item
                        user.type = user.id === parsedRes.user ? 'creator' : 'contributor';
                        //fill in user's contribution
                        user.count = parsedRes.contributors.count;
                        return user;
                    });
                    callback(null, {contributors: contributors, selector: selector});
                }).catch((err) => {
                    console.log(err);
                    callback(err);
                });
            }).catch((err) => {
                console.log(err);
                callback(err);
            });
        }
    }
};
