import { Microservices } from '../configs/microservices';
import rp from 'request-promise';

export default {
    name: 'userProfile',

    delete: (req, resource, params, config, callback) => {
        //let args = params.params ? params.params : params;
        // callback(null, params); //TODO implement backend delete call
        rp({
            method: 'DELETE',
            uri: Microservices.user.uri + '/user/' + '5799ff4292164736e14498b4',
            headers: {'----jwt----' : 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI1Nzk5ZmY0MjkyMTY0NzM2ZTE0NDk4YjQiLCJpYXQiOjE0Njk3MTAxNTR9.eFeINyrbYNJZE2XJrWE_zXfv0lh42sb7s_2BYn5Gry-3neSwnBoeTyHFeE-rssEhw1zJyevS2-iOYOAYyF5Aig'} //TODO add proper JWT
        }).then((body) => callback(null, params))
        .catch((err) => {console.log(err);callback(err);});
    },

    update: (req, resource, params, body, config, callback) => {
        //let args = params.params ? params.params : params;
        if(resource === 'userProfile.updatePassword'){
            let tosend = {
                oldPassword: params.oldpw,
                newPassword: params.newpw
            };
            // callback(null, {}); //TODO implement backend update call
            rp({
                method: 'PUT',
                uri: Microservices.user.uri + '/user/' + '5799ff4292164736e14498b4' + '/passwd',
                headers: {'----jwt----' : 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI1Nzk5ZmY0MjkyMTY0NzM2ZTE0NDk4YjQiLCJpYXQiOjE0Njk3MTAxNTR9.eFeINyrbYNJZE2XJrWE_zXfv0lh42sb7s_2BYn5Gry-3neSwnBoeTyHFeE-rssEhw1zJyevS2-iOYOAYyF5Aig'}, //TODO add proper JWT
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
            // callback(null, params); //TODO implement backend update call
            rp({
                method: 'PUT',
                uri: Microservices.user.uri + '/user/' + '5799ff4292164736e14498b4' + '/profile',
                headers: {'----jwt----' : 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI1Nzk5ZmY0MjkyMTY0NzM2ZTE0NDk4YjQiLCJpYXQiOjE0Njk3MTAxNTR9.eFeINyrbYNJZE2XJrWE_zXfv0lh42sb7s_2BYn5Gry-3neSwnBoeTyHFeE-rssEhw1zJyevS2-iOYOAYyF5Aig'}, //TODO add proper JWT
                json: true,
                body: tosend
            }).then((body) => callback(null, params))
            .catch((err) => {console.log(err);callback(err);});
        } else {
            callback('failure');
        }
    },

    read: (req, resource, params, config, callback) => {
        //let args = params.params ? params.params : params;
        // let template = {
        //     email: 'roy-meissner@gmx.net',
        //     uname: 'rmeissn',
        //     lname: 'Meissner',
        //     fname: 'Roy',
        //     language: 'de_DE',
        //     country: 'Germany',
        //     picture: ''
        // };
        // callback(null, template);
        rp({
            method: 'GET',
            uri: Microservices.user.uri + '/user/' + '5799ff4292164736e14498b4' + '/profile',
            headers: {'----jwt----' : 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI1Nzk5ZmY0MjkyMTY0NzM2ZTE0NDk4YjQiLCJpYXQiOjE0Njk3MTAxNTR9.eFeINyrbYNJZE2XJrWE_zXfv0lh42sb7s_2BYn5Gry-3neSwnBoeTyHFeE-rssEhw1zJyevS2-iOYOAYyF5Aig'}, //TODO add proper JWT
            json: true
        }).then((body) => {
            let converted = {
                email: body.email,
                uname: body.username,
                lname: body.surname,
                fname: body.forename,
                language: body.language,
                country: body.country, //optional
                picture: body.picture === null ? '' : body.picture //optional
            };
            callback(null, converted);
        })
        .catch((err) => {console.log(err);callback(err);});
    }
};
