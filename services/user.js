import { Microservices } from '../configs/microservices';
import { resetPasswordAPIKey } from '../configs/general';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'user',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params ? params.params : params;
        // let selector = {
        //     'id': parseInt(args.id),
        //     'spath': args.spath,
        //     'sid': args.sid,
        //     'stype': args.stype,
        //     'page': params.page
        // };

        if (resource === 'user.item') {
            let user = {};
            callback(null, {
                user: user
            });

        } else if (resource === 'user.signin') {
            const hashedPassword = args.password;
            rp.post({
                uri: Microservices.user.uri + '/login',
                body: JSON.stringify({
                    email: args.email,
                    password: hashedPassword
                }),
                resolveWithFullResponse: true
            })
                .then((res) => {
                    callback(null, {
                        username: JSON.parse(res.body).username,
                        userid: JSON.parse(res.body).userid,
                        jwt: res.headers['----jwt----']
                    });
                })
                .catch((err) => {
                    // console.log('Error', err);
                    callback(err, {
                        error: err
                    });
                });
        } else if (resource === 'user.socialsignin') {
            rp.post({
                uri: Microservices.user.uri + '/social/login',
                body: JSON.stringify({
                    identifier: args.identifier,
                    provider: args.provider,
                    token: args.token,
                    scope: args.scope,
                    token_creation: args.token_creation,
                    email: args.email,
                    language: args.language
                }),
                resolveWithFullResponse: true
            })
                .then((res) => {
                    callback(null, {
                        username: JSON.parse(res.body).username,
                        userid: JSON.parse(res.body).userid,
                        jwt: res.headers['----jwt----']
                    });
                })
                .catch((err) => {
                    // console.log('Error', err);
                    callback(err, null);
                });
        } else if (resource === 'user.checkemail') {
            let regExp = /\S+@\S+\.\S+/;
            if (args.email === '' || !regExp.test(args.email)) {//Do not call microservice with invalid email
                callback(null, {taken: undefined});
            } else {
                rp.get({uri: Microservices.user.uri + '/information/email/' + args.email}).then((res) => {
                    callback(null, JSON.parse(res));
                }).catch((err) => {
                    console.log(err);
                    callback(null, {});
                });
            }
        } else if (resource === 'user.checkusername') {
            let regExp = /^[a-z0-9]+$/i;
            if (args.username === '' || !regExp.test(args.username)) {//Do not call microservice with invalid username
                callback(null, {username: '', res: {taken: undefined, alsoTaken:[]}});
            } else {
                rp.get({uri: Microservices.user.uri + '/information/username/' + args.username}).then((res) => {
                    callback(null, {username: args.username, res: JSON.parse(res)});
                }).catch((err) => {
                    console.log(err);
                    callback(null, {});
                });
            }
        }
    },

    create: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'create', Method: req.method});
        let args = params.params ? params.params : params;
        if (resource === 'user.registration') {
            const hashedPassword = args.password;
            const PRIVATE_KEY = '6LdNLyYTAAAAAFMC0J_zuVI1b9lXWZjPH6WLe-vJ';
            rp.post({
                uri: 'https://www.google.com/recaptcha/api/siteverify',
                form: {
                    secret: PRIVATE_KEY,
                    response: args.grecaptcharesponse
                }
            })
                .then((res) => {
                    // console.log('Res', res);
                    if (JSON.parse(res).success === true) {//Recaptcha OK - call microservice
                        rp.post({
                            uri: Microservices.user.uri + '/register',
                            body: JSON.stringify({
                                forename: args.firstname,
                                surname: args.lastname,
                                username: args.username,
                                email: args.email,
                                password: hashedPassword,
                                language: args.language
                            })
                        })
                            .then((res) => {
                                console.log('Res', JSON.parse(res));
                                callback(null, {
                                    res: res
                                });
                            })
                            .catch((err) => {
                                // console.log('Error', err);
                                callback(err, {
                                    error: err
                                });
                                // callback(null, {
                                //     selector: args.selector
                                // });
                            });
                    } else {
                        const err = {
                            message: '422 - "{"message": "Wrong captcha. Please verify that you are human."}"'
                        };
                        callback(err, {
                            error: err
                        });
                    }
                })
                .catch((err) => {
                    // console.log('Error', err);
                    callback(err, {
                        error: err
                    });
                });
        }
        else if (resource === 'user.socialregistration') {
            // console.log('Sending data to social/register', {
            //     id: args.id,
            //     provider: args.provider,
            //     token: args.token,
            //     scope: args.scope,
            //     token_creation: args.token_creation,
            //     email: args.email,
            //     language: args.language,
            //     username: args.username,
            //     forename: args.forename,
            //     surname: args.surname
            // });
            rp.post({
                uri: Microservices.user.uri + '/social/register',
                body: JSON.stringify({
                    identifier: args.identifier,
                    provider: args.provider,
                    token: args.token,
                    scope: args.scope,
                    token_creation: args.token_creation,
                    email: args.email,
                    language: args.language,
                    username: args.username,
                    forename: args.forename,
                    surname: args.surname
                }),
                resolveWithFullResponse: true
            })
              .then((res) => {
                  // console.log('And we got', res.body);
                  callback(null, {
                      username: JSON.parse(res.body).username,
                      userid: JSON.parse(res.body).userid,
                      jwt: res.headers['----jwt----']
                  });
              })
              .catch((err) => {
                  // console.log('Error', err);
                  callback(err, null);
              });
        }
    },

    // other methods
    update: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'update', Method: req.method});
        if (resource === 'user.resetPassword') {
            rp.put({
                uri: Microservices.user.uri + '/resetPassword',
                body: JSON.stringify({
                    email: params.email,
                    language: params.language,
                    APIKey: resetPasswordAPIKey
                }),
                resolveWithFullResponse: true
            }).then((res) => {
                callback(null, res);  //no JSON
            }).catch((err) => {
                callback(err, {});
            });
        }
    }
        // delete: (req, resource, params, config, callback) => {}
};
