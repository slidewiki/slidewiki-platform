import { Microservices } from '../configs/microservices';
import rp from 'request-promise';

export default {
    name: 'userProfile',

    delete: (req, resource, params, config, callback) => {
        callback(null, params); //TODO implement backend delete call
        return;
        rp({
            method: 'DELETE',
            uri: Microservices.user.uri + '/user/' + params.params.id,
            headers: {'----jwt----' : params.params.jwt}
        }).then((body) => callback(null, params))
        .catch((err) => {console.log(err);callback(err);});
    },

    update: (req, resource, params, body, config, callback) => {
        if(resource === 'userProfile.updatePassword'){
            let tosend = {
                oldPassword: params.oldpw,
                newPassword: params.newpw
            };
            callback(null, {}); //TODO implement backend update call
            return;
            rp({
                method: 'PUT',
                uri: Microservices.user.uri + '/user/' + params.params.id + '/passwd',
                headers: {'----jwt----' : params.params.jwt},
                json: true,
                body: tosend
            }).then((body) => callback(null, {}))
            .catch((err) => {console.log(err);callback(err);});
        } else if (resource === 'userProfile.update'){
            let tosend = {
                email: params.email,
                username: params.uname,
                surname: params.lname,
                forename: params.fname,
                language: params.language,
                country: params.country,
                picture: params.picture,
                organization: params.organization,
                description: ''
            };
            callback(null, params); //TODO implement backend update call
            return;
            rp({
                method: 'PUT',
                uri: Microservices.user.uri + '/user/' + params.params.id + '/profile',
                headers: {'----jwt----' : params.params.jwt},
                json: true,
                body: tosend
            }).then((body) => callback(null, params))
            .catch((err) => {console.log(err);callback(err);});
        } else {
            callback('failure');
        }
    },

    read: (req, resource, params, config, callback) => {
        // let template = {
        //     email: 'roy-meissner@gmx.net',
        //     uname: params.params.username,
        //     lname: 'Meissner',
        //     fname: 'Roy',
        //     language: 'de_DE',
        //     country: 'Germany',
        //     picture: '',
        //     organization: 'InfAI'
        // };
        // callback(null, template);
        // return;
        console.log(params);
        if(params.params.loggedInUser === params.params.username || params.params.id === params.params.username){
            console.log('richtiger zweig');
            console.log(params.params);
            rp({
                method: 'GET',
                uri: Microservices.user.uri + '/user/' + params.params.id + '/profile',
                headers: {'----jwt----' : params.params.jwt},
                json: true
            }).then((body) => {
                console.log(body);
                let converted = {
                    email: body.email,
                    uname: body.username,
                    lname: body.surname,
                    fname: body.forename,
                    language: body.language,
                    country: body.country === undefined ? '' : body.country, //optional
                    picture: body.picture === undefined ? '' : body.picture, //optional
                    organization : body.organization === undefined ? '' : body.organization //optional
                };
                callback(null, converted);
            })
            .catch((err) => {console.log(err);callback(err);});
        } else {
            rp({
                method: 'GET',
                uri: Microservices.user.uri + '/user/' + params.params.username,
                json: true
            }).then((body) => {
                let converted = {
                    uname: body.username,
                    lname: body.surname,
                    fname: body.forename,
                    language: body.language,
                    country: body.country === undefined ? '' : body.country, //optional
                    picture: body.picture === undefined ? '' : body.picture, //optional
                    organization : body.organization === undefined ? '' : body.organization //optional
                };
                callback(null, converted);
            })
            .catch((err) => {console.log(err);callback(err);});
        }

    }
};
