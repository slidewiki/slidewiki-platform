'use strict';

export default {
    name: 'contributors',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        /*********connect to microservices*************/
        //todo
        /*********received data from microservices*************/
        let args = params.params? params.params : params;
        //set default values if no selector is defined in the URL
        let cid = args.sid? args.sid : args.id;
        let sampleData = [
            {'id': cid + '1', 'username': 'ali1k', 'organization': 'VUA'},
            {'id': cid + '2', 'username': 'soeren', 'organization': 'Fraunhofer'},
            {'id': cid + '3', 'username': 'darya', 'organization': 'Bonn'}
        ];
        callback(null, {contributors: sampleData});
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
