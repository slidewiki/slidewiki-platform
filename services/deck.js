'use strict';

export default {
    name: 'deck',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        if(resource === 'deck.content'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            let sampleContent = 'this is a sample deck content';
            callback(null, {content: sampleContent});
        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
