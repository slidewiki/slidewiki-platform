import rp from 'request-promise';
import { isEmpty } from '../common.js';
import { Microservices } from '../configs/microservices';
const log = require('../configs/log').log;

export default {
    name: 'userProfile',

    delete: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'delete', Method: req.method});
        rp({
            method: 'DELETE',
            uri: Microservices.user.uri + '/user/' + params.params.id,
            headers: { '----jwt----': params.params.jwt }
        })
        .then((body) => callback(null, params))
        .catch((err) => callback(err));
    },

    update: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'update', Method: req.method});
        if (resource === 'userProfile.updatePassword') {
            let tosend = {
                oldPassword: params.oldpw,
                newPassword: params.newpw
            };
            rp({
                method: 'PUT',
                uri: Microservices.user.uri + '/user/' + params.params.id + '/passwd',
                headers: { '----jwt----': params.params.jwt },
                json: true,
                body: tosend
            })
            .then((body) => callback(null, {}))
            .catch((err) => callback(err));
        } else if (resource === 'userProfile.update') {
            let tosend = {
                email: params.email,
                username: params.uname,
                surname: !isEmpty(params.lname) ? params.lname : '',
                forename: !isEmpty(params.fname) ? params.fname : '',
                language: !isEmpty(params.language) ? params.language : '',
                country: !isEmpty(params.country) ? params.country : '',
                picture: !isEmpty(params.picture) ? params.picture : '',
                organization: !isEmpty(params.organization) ? params.organization : '',
                description: !isEmpty(params.description) ? params.description : ''
            };
            rp({
                method: 'PUT',
                uri: Microservices.user.uri + '/user/' + params.params.id + '/profile',
                headers: { '----jwt----': params.params.jwt },
                json: true,
                body: tosend
            })
            .then((body) => callback(null, params))
            .catch((err) => callback(err));
        } else if (resource === 'userProfile.removeProvider') {
            rp({
                method: 'DELETE',
                uri: Microservices.user.uri + '/social/provider/' + params.provider,
                headers: { '----jwt----': params.jwt },
                json: true
            })
            .then((body) => callback(null, body))
            .catch((err) => callback(err));
        } else if (resource === 'userProfile.addProvider') {
            rp({
                method: 'PUT',
                uri: Microservices.user.uri + '/social/provider/' + params.provider,
                headers: { '----jwt----': params.jwt },
                json: true,
                body: {
                    provider: params.provider,
                    identifier: params.identifier,
                    token: params.token,
                    token_creation: params.token_creation,
                    email: params.email,
                    language: params.language
                }
            })
              .then((body) => callback(null, body))
              .catch((err) => callback(err));
        } else if (resource === 'userProfile.saveUsergroup') {
            //prepare data
            let members = params.members.reduce((prev, curr) => {
                let member = {
                    userid: curr.userid,
                    joined: curr.joined || ''
                };
                prev.push(member);
                return prev;
            }, []);
            let tosend = {
                id: params.id,
                name: params.name,
                description: !isEmpty(params.description) ? params.description : '',
                isActive: !isEmpty(params.isActive) ? params.isActive : true,
                timestamp: !isEmpty(params.timestamp) ? params.timestamp : '',
                members: members,
                referenceDateTime: (new Date()).toISOString()
            };
            // console.log('sending:', tosend, params.jwt);
            rp({
                method: 'PUT',
                uri: Microservices.user.uri + '/usergroup/createorupdate',
                headers: { '----jwt----': params.jwt },
                json: true,
                body: tosend,
                timeout: body.timeout
            })
            .then((body) => callback(null, body))
            .catch((err) => callback(err));
        } else if (resource === 'userProfile.deleteUsergroup') {
            rp({
                method: 'DELETE',
                uri: Microservices.user.uri + '/usergroup/' + params.groupid,
                headers: { '----jwt----': params.jwt },
                json: true,
                timeout: body.timeout
            })
            .then((body) => callback(null, body))
            .catch((err) => callback(err));
        } else if (resource === 'userProfile.leaveUsergroup') {
            rp({
                method: 'PUT',
                uri: Microservices.user.uri + '/usergroup/' + params.groupid + '/leave',
                headers: { '----jwt----': params.jwt },
                json: true,
                timeout: body.timeout
            })
            .then((body) => callback(null, body))
            .catch((err) => callback(err));
        } else {
            callback('failure');
        }
    },

    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        if(resource !== 'userProfile.fetchUserDecks') {
            if (params.params.loggedInUser === params.params.username || params.params.id === params.params.username) {
                rp({
                    method: 'GET',
                    uri: Microservices.user.uri + '/user/' + params.params.id + '/profile',
                    headers: { '----jwt----': params.params.jwt },
                    json: true
                })
                .then((body) => {
                    //console.log(body);
                    let converted = {
                        id: body._id,
                        uname: body.username,
                        email: body.email,
                        lname: !isEmpty(body.surname) ? body.surname : '',
                        fname: !isEmpty(body.forename) ? body.forename : '',
                        language: !isEmpty(body.language) ? body.language : '',
                        country: !isEmpty(body.country) ? body.country : '',
                        picture: !isEmpty(body.picture) ? body.picture : '',
                        organization: !isEmpty(body.organization) ? body.organization : '',
                        description: !isEmpty(body.description) ? body.description : '',
                        hasPassword: body.hasPassword || false,
                        providers: body.providers || [],
                        groups: !isEmpty(body.groups) ? body.groups : []
                    };
                    callback(null, converted);
                })
                .catch((err) => callback(err));
            } else {
                rp({
                    method: 'GET',
                    uri: Microservices.user.uri + '/user/' + params.params.username,
                    json: true
                })
                .then((body) => {
                    let converted = {
                        id: body._id,
                        uname: body.username,
                        email: !isEmpty(body.email) ? body.email : '',
                        lname: !isEmpty(body.surname) ? body.surname : '',
                        fname: !isEmpty(body.forename) ? body.forename : '',
                        language: !isEmpty(body.language) ? body.language : '',
                        country: !isEmpty(body.country) ? body.country : '',
                        picture: !isEmpty(body.picture) ? body.picture : '',
                        organization: !isEmpty(body.organization) ? body.organization : '',
                        description: !isEmpty(body.description) ? body.description : ''
                    };
                    callback(null, converted);
                })
                .catch((err) => callback(err));
            }
        } else {
            //TODO get id of a user
            if(!isEmpty(params.params.jwt) && params.params.loggedInUser === params.params.username){
                rp({
                    method: 'GET',
                    uri: Microservices.deck.uri + '/alldecks/' + params.params.id,
                    json: true
                })
                .then((body) => {
                    let converted = body.map((deck) => {
                        return {
                            title: !isEmpty(deck.title) ? deck.title : 'No Title',
                            picture: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Business_presentation_byVectorOpenStock.jpg',
                            description: !isEmpty(deck.description) ? deck.description : 'No Description',
                            updated: !isEmpty(deck.lastUpdate) ? deck.lastUpdate : (new Date()).setTime(1).toISOString(),
                            creationDate: !isEmpty(deck.timestamp) ? deck.timestamp : (new Date()).setTime(1).toISOString(),
                            deckID: deck._id,
                            firstSlide: deck.firstSlide,
                            language:deck.language,
                            countRevisions:deck.countRevisions

                        };
                    }).sort((a,b) => a.creationDate < b.creationDate);
                    callback(null, converted);
                })
                .catch((err) => callback(err));
            } else if(params.params.loggedInUser !== params.params.username) {
                //get id of username
                rp({
                    method: 'GET',
                    uri: Microservices.deck.uri + '/alldecks/' + params.params.id2,
                    json: true
                })
                .then((body) => {
                    let converted = body.map((deck) => {
                        console.log(deck);
                        return {
                            title: !isEmpty(deck.title) ? deck.title : 'No Title',
                            picture: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Business_presentation_byVectorOpenStock.jpg',
                            description: !isEmpty(deck.description) ? deck.description : 'No Description',
                            updated: !isEmpty(deck.lastUpdate) ? deck.lastUpdate : (new Date()).setTime(1).toISOString(),
                            creationDate: !isEmpty(deck.timestamp) ? deck.timestamp : (new Date()).setTime(1).toISOString(),
                            deckID: deck._id,
                            firstSlide: deck.firstSlide,
                            language:deck.language,
                            countRevisions:deck.countRevisions
                        };
                    });
                    callback(null, converted);
                })
                .catch((err) => callback(err));
            }
        }
    }
};
