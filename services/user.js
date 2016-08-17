import { Microservices } from '../configs/microservices';
import { hashSalt } from '../configs/general';
import rp from 'request-promise';
import sha512 from 'js-sha512';

export default {
    name: 'user',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
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
            const hashedPassword = sha512.sha512(args.password + hashSalt);
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
        } else if (resource === 'user.checkemail') {
            rp.get({uri: Microservices.user.uri + '/information/email/' + args.email}).then((res) => {
                callback(null, JSON.parse(res));
            }).catch((err) => {
                console.log(err);
                callback(null, {});
            });
        } else if (resource === 'user.checkusername') {
          console.log(args.username);
            rp.get({uri: Microservices.user.uri + '/information/username/' + args.username}).then((res) => {
                callback(null, JSON.parse(res));
            }).catch((err) => {
                console.log(err);
                callback(null, {});
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
    }
        // other methods
        // update: (req, resource, params, body, config, callback) => {}
        // delete: (req, resource, params, config, callback) => {}
};
