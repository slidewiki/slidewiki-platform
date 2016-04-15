export default {
    name: 'translation',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        if(resource === 'translation.list'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            let translations = [];

            if(args.sid%2===0){
                translations=[
            	                {'lang': 'EN', 'id': 343},
            	                {'lang': 'DE', 'id': 32}
                ];
            }
            else{
                translations = [
            	                {'lang': 'ES', 'id': 56},
            	                {'lang': 'GR', 'id': 71}
                ];
            }



            let currentLang = {'lang': 'EN', 'id': 343};
            callback(null, {translations: translations, currentLang: currentLang});
        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
