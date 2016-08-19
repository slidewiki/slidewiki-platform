import sha512 from 'js-sha512';
import rp from 'request-promise';
import { isEmpty } from '../common.js';
import { hashSalt } from '../configs/general';
import { Microservices } from '../configs/microservices';

export default {
    name: 'userProfile',

    delete: (req, resource, params, config, callback) => {
        rp({
            method: 'DELETE',
            uri: Microservices.user.uri + '/user/' + params.params.id,
            headers: { '----jwt----': params.params.jwt }
        })
        .then((body) => callback(null, params))
        .catch((err) => callback(err));
    },

    update: (req, resource, params, body, config, callback) => {
        if (resource === 'userProfile.updatePassword') {
            let tosend = {
                oldPassword: sha512.sha512(params.oldpw + hashSalt),
                newPassword: sha512.sha512(params.newpw + hashSalt)
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
                description: !isEmpty(params.description) ? params.description : ''
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
        } else {
            callback('failure');
        }
    },

    read: (req, resource, params, config, callback) => {
        if (params.params.loggedInUser === params.params.username || params.params.id === params.params.username) {
            rp({
                method: 'GET',
                uri: Microservices.user.uri + '/user/' + params.params.id + '/profile',
                headers: { '----jwt----': params.params.jwt },
                json: true
            })
            .then((body) => {
                console.log(body);
                let converted = {
                    uname: body.username,
                    email: body.email,
                    lname: !isEmpty(body.surname) ? body.surname : '',
                    fname: !isEmpty(body.forename) ? body.forename : '',
                    language: !isEmpty(body.language) ? body.language : '',
                    country: !isEmpty(body.country) ? body.country : '',
                    picture: !isEmpty(body.picture) ? body.picture : '',
                    organization: !isEmpty(body.organization) ? body.organization : '',
                    description: !isEmpty(body.description) ? body.description : ''
                };
                callback(null, converted);
            })
            .catch((err) => callback(err));
        } else {
            rp({
                method: 'GET',
                uri: Microservices.user.uri + '/user/' + params.params.username,
                json: true
            })
            .then((body) => {
                let converted = {
                    uname: body.username,
                    email: !isEmpty(body.email) ? body.email : '',
                    lname: !isEmpty(body.surname) ? body.surname : '',
                    fname: !isEmpty(body.forename) ? body.forename : '',
                    language: !isEmpty(body.language) ? body.language : '',
                    country: !isEmpty(body.country) ? body.country : '',
                    picture: !isEmpty(body.picture) ? body.picture : '',
                    organization: !isEmpty(body.organization) ? body.organization : '',
                    description: !isEmpty(body.description) ? body.description : ''
                };
                callback(null, converted);
            })
            .catch((err) => callback(err));
        }
    }
};
