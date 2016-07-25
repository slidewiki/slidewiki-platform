import { Microservices } from '../configs/microservices';
import rp from 'request-promise';

export default {
    name: 'userProfile',

    delete: (req, resource, params, config, callback) => {
        //let args = params.params ? params.params : params;
        rp({
            method: 'DELETE',
            uri: Microservices.user + '/user/' + id,
            headers: {'----jwt----' : '123456'}, //TODO add proper JWT
            json: true
        }).then((body) => callback(null, {}))
        .catch((err) => callback(err));
    },

    update: (req, resource, params, body, config, callback) => {
        //let args = params.params ? params.params : params;
        if(resource === 'userProfile.removePicture'){
            callback(null,{}); //TODO implement backend update call
        } else {
            rp({
                method: 'PUT',
                uri: Microservices.user + '/user/' + id,
                headers: {'----jwt----' : '123456'}, //TODO add proper JWT
                json: true
            }).then((body) => callback(null, {}))
            .catch((err) => callback(err));
        }
    },

    read: (req, resource, params, config, callback) => {
        //let args = params.params ? params.params : params;
        rp({
            method: 'GET',
            uri: Microservices.user + '/user/' + id,
            headers: {'----jwt----' : '123456'}, //TODO add proper JWT
            json: true
        }).then((body) => callback(null, {}))
        .catch((err) => callback(err));
    }
};
