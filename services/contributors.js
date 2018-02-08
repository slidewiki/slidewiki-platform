import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'contributors',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params ? params.params : params;
        let selector = {'sid': args.sid, 'stype': args.stype, 'spath': args.spath};
        if (resource === 'contributors.list') {
            //request specific content item from deck service
            rp.get({uri: Microservices.deck.uri + '/' + selector.stype + '/' + selector.sid}).then((deck) => {
                let parsedDeck = JSON.parse(deck);
                let userPromises = parsedDeck.contributors.map((contributor) => {
                    return rp.get({uri: Microservices.user.uri + '/user/' + contributor.user});
                });
                //when all user data is fetched successfully return from service
                Promise.all(userPromises).then((users) => {
                    let contributors = users.map((user) => {
                        let contributor = JSON.parse(user);
                        contributor.id = contributor._id;
                        //if user is the creator of an item
                        contributor.type = contributor.id === parsedDeck.user ? 'creator' : 'contributor';
                        let initial_data = parsedDeck.contributors.filter((initial_contributor) => {
                            return initial_contributor.user === contributor.id;
                        });
                        //console.log(initial_data);
                        // //fill in user's contribution
                        contributor.count = initial_data[0].count;
                        //console.log(user);
                        return contributor;
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
