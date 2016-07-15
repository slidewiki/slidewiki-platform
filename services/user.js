import { Microservices } from '../configs/microservices';
import rp from 'request-promise';

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
            rp.post({
                uri: Microservices.user.uri + '/register',
                body: JSON.stringify({
                    email: args.email,
                    forename: args.firstname,
                    surname: args.lastname,
                    username: args.username,
                    password: args.password,
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
