import {Microservices} from '../configs/microservices';
import rp from 'request-promise';

export default {
    name: 'home',
    // At least one of the CRUD methods is Required
    read: (req, resource, payload, config, callback) => {

        let limit = '3'; //TODO
        let offset = '3'; //TODO
        if(resource === 'home.featured'){
            /*********connect to microservices*************/

            rp.get({uri: Microservices.deck.uri + '/allfeatured/' + limit + '/' + offset}).then((res) => {
                callback(null, {featured: JSON.parse(res)});
            }).catch((err) => {
                callback(err, {featured: []});
            });
        }
    }
};
