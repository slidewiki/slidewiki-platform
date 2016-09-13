import { Microservices } from '../configs/microservices';
import rp from 'request-promise';

export default {
    name: 'deck',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        if (resource === 'deck.content') {
            /* Create promise for deck data success */
            let deckRes = rp.get({uri: Microservices.deck.uri + '/deck/' + args.sid});
            /* Create promise for slides data success */
            let slidesRes = rp.get({uri: Microservices.deck.uri + '/deck/' + args.sid + '/slides'});
            /* Catch errors from deck data response */
            let deckPromise = deckRes.catch((err) => {
                callback({msg: 'Error in retrieving deck meta data ' + Microservices.deck.uri + ',', content: err}, {});
            });
            /* Catch erros from slides data response */
            let slidesPromise = slidesRes.catch((err) => {
                callback({msg: 'Error in retrieving slides data from ' + Microservices.deck.uri + ' service! Please try again later...', content: err}, {});
            });
            /* Create user data promise which is dependent on deck data promise */
            let userRes = deckPromise.then((deckData) => {
                // TODO Replace hard coded user id '15' with the commented JSON data;
                // This should be done when deckservice and userservice data is in sync;
                return rp.get({uri: Microservices.user.uri + '/user/' + '15'});//(JSON.parse(deckData).user).toString()});
            });
            /* Catch errors from the user data response */
            let userPromise = userRes.catch((err) => {
                callback({msg: 'Error in retrieving user data from ' + Microservices.user.uri, content: err}, {});
            });

            /* Create promise which resolves when all the three promises are resolved or fails when any one of the three promises fails */
            Promise.all([deckPromise, slidesPromise, userPromise]).then((data) => {
                //console.log('deck data:', data[0]);
                console.log('slides data:', data[1]);
                //console.log('user data:', data[2]);
                callback(null, {deckData: JSON.parse(data[0]), slidesData: JSON.parse(data[1]), userData: JSON.parse(data[2])});
            }).catch((err) => {
                //console.log(err);
                callback({msg: 'Error in resolving promiese', content: err}, {});
            });
        }
        else if (resource === 'deck.properties') {
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            let deckProps = {
                'title': 'Sample Deck Title',
                'language': 'EN',
                'tags': ['RDF', 'Semantic Web', 'Linked Data']
            };
            callback(null, {deckProps: deckProps});
        } else if(resource === 'deck.numberofslides'){
            let args = params.params? params.params : params;
            rp.get({uri: Microservices.deck.uri + '/deck/' + args.id + '/slides'}).then((res) => {
                callback(null, {noofslides: JSON.parse(res).children.length});
            }).catch((err) => {
                console.log('serviceErr', err);
                callback(null, {noofslides: 0});
            });
        }
    },
    // other methods
    create: (req, resource, params, body, config, callback) => {

        if(resource === 'deck.create') {
            if (params.tags.length === 1 && params.tags[0].length === 0)
                params.tags = undefined;
            let toSend = {
                description: params.description ? params.description : 'empty',
                language: params.language,
                translation: {
                    status: 'original'
                },
                tags: params.tags,
                title: params.title,
                user: params.userid.toString(),
                license: params.licence
            };
            rp({
                method: 'POST',
                uri: Microservices.deck.uri + '/deck/new',
                json: true,
                body: toSend
            }).then((deck) => callback(false, deck))
            .catch((err) => callback(err));
        }
    },
    update: (req, resource, params, body, config, callback) => {
        if(resource === 'deck.update') {
            if (params.tags.length === 1 && params.tags[0].length === 0)
                params.tags = undefined;
            let toSend = {
                description: params.description ? params.description : 'empty',
                language: params.language,
                tags: params.tags,
                title: params.title,
                user: params.userid.toString(),
                license: params.licence
            };
            rp({
                method: 'PUT',
                uri: Microservices.deck.uri + '/deck/' + params.deckId,
                json: true,
                body: toSend
            }).then((deck) => callback(false, deck))
            .catch((err) => callback(err));
        }
    }
    // delete: (req, resource, params, config, callback) => {}
};
