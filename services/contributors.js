'use strict';

export default {
    name: 'contributors',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        /*********connect to microservices*************/
        //todo
        /*********received data from microservices*************/
        let sampleData = [
            {'id': 324, 'username': 'ali1k', 'organization': 'VUA'},
            {'id': 394, 'username': 'soeren', 'organization': 'Fraunhofer'},
            {'id': 334, 'username': 'darya', 'organization': 'Bonn'}
        ];
        callback(null, {contributors: sampleData});
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
