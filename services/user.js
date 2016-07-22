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
                    callback(null, {//TODO couldn't return the error using the first parameter
                        error: err,
                        selector: args.selector
                    });
                });
        }
    }
        // other methods
        // create: (req, resource, params, body, config, callback) => {},
        // update: (req, resource, params, body, config, callback) => {}
        // delete: (req, resource, params, config, callback) => {}
};
