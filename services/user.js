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
                    email: args.username,
                    password: args.password.toString(), //TODO add hashing as soon as register is working
                }),
                resolveWithFullResponse: true
            })
                .then((res) => {
                    callback(null, {
                        username: JSON.parse(res.body).username,
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
    }
        // other methods
        // update: (req, resource, params, body, config, callback) => {}
        // delete: (req, resource, params, config, callback) => {}
};
