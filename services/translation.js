export default {
    name: 'translation',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        if(resource === 'translation.list'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            let translations = [
                {'lang': 'EN', 'id': 343},
                {'lang': 'DE', 'id': 32}
            ];
            let currentLang = {'lang': 'EN', 'id': 343};
            callback(null, {translations: translations, currentLang: currentLang});
        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
