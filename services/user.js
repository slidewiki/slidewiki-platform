import { Microservices } from '../configs/microservices';
import { hashSalt } from '../configs/general';
import rp from 'request-promise';
import sha512 from 'js-sha512';

export default {
    name: 'user',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params ? params.params : params;
        let selector = {
            'id': parseInt(args.id),
            'spath': args.spath,
            'sid': args.sid,
            'stype': args.stype,
            'page': params.page
        };

        if (resource === 'user.item') {
            let user = {};
            callback(null, {
                user: user
            });
        }

        if (resource === 'user.signin') {
            const hashedPassword = sha512.sha512(args.password + hashSalt);
            rp.post({
                uri: Microservices.user.uri + '/login',
                body: JSON.stringify({
                    // email: args.email,
                    username: args.username,
                    password: hashedPassword
                }),
                resolveWithFullResponse: true
            })
                .then((res) => {
                    callback(null, {
                        username: args.username,
                        userid: JSON.parse(res.body).userid,
                        jwt: res.headers['----jwt----'],
                        selector: args.selector
                    });
                })
                .catch((err) => {
                    // console.log('Error', err);
                    callback(err, {
                        error: err,
                        selector: args.selector
                    });
                });
        }
    },

    create: (req, resource, params, body, config, callback) => {
        let args = params.params ? params.params : params;
        if (resource === 'user.registration') {
            const hashedPassword = sha512.sha512(args.password + hashSalt);
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
                                    res: res,
                                    selector: args.selector
                                });
                            })
                            .catch((err) => {
                                // console.log('Error', err);
                                callback(err, {
                                    error: err,
                                    selector: args.selector
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
                            error: err,
                            selector: args.selector
                        });
                    }
                })
                .catch((err) => {
                    // console.log('Error', err);
                    callback(err, {
                        error: err,
                        selector: args.selector
                    });
                });
        }
    }
        // other methods
        // update: (req, resource, params, body, config, callback) => {}
        // delete: (req, resource, params, config, callback) => {}
};
