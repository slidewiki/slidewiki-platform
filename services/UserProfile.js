import { Microservices } from '../configs/microservices';
import rp from 'request-promise';

export default {
    name: 'userProfile',

    delete: (req, resource, params, config, callback) => {
        //let args = params.params ? params.params : params;
        callback(null, params); //TODO implement backend delete call
        // rp({
        //     method: 'DELETE',
        //     uri: Microservices.user + '/user/' + id,
        //     headers: {'----jwt----' : '123456'}, //TODO add proper JWT
        //     json: true
        // }).then((body) => callback(null, {}))
        // .catch((err) => callback(err));
    },

    update: (req, resource, params, body, config, callback) => {
        //let args = params.params ? params.params : params;
        if(resource === 'userProfile.updatePassword')
            callback(null, {}); //TODO implement backend update call
        callback(null, params); //TODO implement backend update call
        // rp({
        //     method: 'PUT',
        //     uri: Microservices.user + '/user/' + id,
        //     headers: {'----jwt----' : '123456'}, //TODO add proper JWT
        //     json: true,
        //     body: params
        // }).then((body) => callback(null, params))
        // .catch((err) => callback(err));
    },

    read: (req, resource, params, config, callback) => {
        //let args = params.params ? params.params : params;
        rp({
            method: 'GET',
            uri: Microservices.user + '/user/' + id,
            headers: {'----jwt----' : '123456'}, //TODO add proper JWT
            json: true
        }).then((body) => callback(null, body))
        .catch((err) => callback(err));
    }
};
