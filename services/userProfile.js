import rp from 'request-promise';
import { isEmpty } from '../common.js';
import { Microservices } from '../configs/microservices';
import cookieParser from 'cookie';
import slugify from 'slugify';

const log = require('../configs/log').log;

const user_cookieName = 'user_json_storage';
const secondsCookieShouldBeValid = 60*60*24*14 ;  //2 weeks

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
                description: !isEmpty(params.description) ? params.description : '',
                displayName: !isEmpty(params.displayName) ? params.displayName : ''
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
                    language: params.language,
                }
            })
              .then((body) => callback(null, body))
              .catch((err) => callback(err));
        } else if (resource === 'userProfile.saveUsergroup') {
            //prepare data
            if (params.members === null || params.members === undefined)
                params.members = [];
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
        params = (params.params) ? params.params : params;

        if(resource === 'userProfile.fetchUserDecks') {
            rp({
                method: 'GET',
                uri: Microservices.deck.uri + '/alldecks/' + params.id2,
                json: true
            }).then((response) => {
                if (params.showQuestionCounts === true) {
                    let questionPromises = response.map( (deck) => {
                        return rp.get({
                            uri: `${Microservices.questions.uri}/deck/${deck._id}/questions`,
                            qs: {
                                metaonly: true,
                                include_subdecks_and_slides: true,
                            },
                            json: true,
                        });
                    });

                    return Promise.all(questionPromises).then( (questionCounts) => {
                        for (let i = 0; i < questionCounts.length; i++) {
                            response[i].questionsCount = questionCounts[i].count;
                        }
                        let converted = response.map((deck) => { return transform(deck); });
                        callback(null, converted);
                    });
                } else {
                    callback(null, response.map( (deck) => transform(deck)));
                }
                
            }).catch((err) => callback(err));
        } else if (resource === 'userProfile.fetchUserOwnedDecks'){
            let requestCall = '';

            // if we want to load more results, we already have a next link
            // from the previous response of the deck-service
            if (params.nextLink){
                requestCall = {
                    uri: `${Microservices.deck.uri}${params.nextLink}`,
                    json: true
                };
            } else {
                requestCall = {
                    method: 'GET',
                    uri: `${Microservices.deck.uri}/decks`,
                    qs: {
                        user: params.id2,
                        roles: params.roles,
                        rootsOnly: true,
                        sort: (params.sort || 'lastUpdate'),
                        status: params.status || 'any',
                        page: params.page,
                        pageSize: 30
                    },
                    json: true
                };
            }

            if(params.jwt){
                requestCall.headers = { '----jwt----': params.jwt };
            }

            rp(requestCall).then( (response) => {
                let decks = response.items;

                //get the number of likes
                let arrayOfPromises = [];
                decks.forEach((deck) => {
                    let promise = rp.get({
                        uri: Microservices.activities.uri + '/activities/deck/' + deck._id,
                        qs: {
                            metaonly: true,
                            activity_type: 'react',
                            all_revisions: true
                        }
                    });
                    arrayOfPromises.push(promise);
                });

                return Promise.all(arrayOfPromises).then((numbers) => {
                    for (let i = 0; i < numbers.length; i++) {
                        decks[i].noOfLikes = numbers[i];
                    }

                    let converted = decks.map((deck) => { return transform(deck); });

                    callback(null, {
                        metadata: response._meta,
                        decks: converted
                    });
                });
            }).catch((err) => callback(err));
        } else {
            if (params.loggedInUser === params.username || params.id === params.username) {
                // console.log('trying to get private user with id: ', params);
                rp({
                    method: 'GET',
                    uri: Microservices.user.uri + '/user/' + params.id + '/profile',
                    headers: { '----jwt----': params.jwt },
                    resolveWithFullResponse: true,
                })
                .then((response) => {
                    //console.log(body);
                    let body = JSON.parse(response.body);
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
                        groups: !isEmpty(body.groups) ? body.groups : [],
                        displayName: !isEmpty(body.displayName) ? body.displayName : ''
                    };
                    callback(null, converted, {
                        headers: {
                            'Set-Cookie': cookieParser.serialize(user_cookieName, JSON.stringify({
                                username: body.username,
                                userid: body._id,
                                jwt: response.headers['----jwt----'],
                            }), {
                                maxAge: secondsCookieShouldBeValid,
                                sameSite: true,
                                path: '/',
                            }),
                        }
                    });
                })
                .catch((err) => callback(err));
            } else {
                // console.log('trying to get public user with username: ', params);
                rp({
                    method: 'GET',
                    uri: Microservices.user.uri + '/user/' + params.username,
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
                        description: !isEmpty(body.description) ? body.description : '',
                        displayName: !isEmpty(body.displayName) ? body.displayName : ''
                    };
                    callback(null, converted);
                })
                .catch((err) => callback(err));
            }
        }
    }
};

function transform(deck){
    return {
        title: !isEmpty(deck.title) ? deck.title : 'No Title',
        slug: buildSlug(deck),
        picture: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Business_presentation_byVectorOpenStock.jpg',
        description: deck.description,
        updated: !isEmpty(deck.lastUpdate) ? deck.lastUpdate : (new Date()).setTime(1).toISOString(),
        creationDate: !isEmpty(deck.timestamp) ? deck.timestamp : (new Date()).setTime(1).toISOString(),
        hidden: deck.hidden,
        deckID: deck._id,
        firstSlide: deck.firstSlide,
        theme: deck.theme,
        language:deck.language,
        countRevisions:deck.countRevisions,
        noOfLikes: deck.noOfLikes,
        questionsCount: deck.questionsCount,
    };
}

function buildSlug(deck) {
    return slugify(deck.title || '').toLowerCase() || '_';
}
