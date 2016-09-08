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
                //TODO Replace user id '4' with JSON.parse(data[0]).user when deckservice and userservice data is in sync
                return rp.get({uri: Microservices.user.uri + '/user/' + '15'});//(JSON.parse(deckData).user).toString()});//JSON.parse(deckData).user});
            });
            /* Catch errors from the user data response */
            let userPromise = userRes.catch((err) => {
                callback({msg: 'Error in retrieving user data from ' + Microservices.user.uri, content: err}, {});
            });

            /* Create promise which resolves when all the three promises are resolved or fails when any one of the three promises fails */
            Promise.all([deckPromise, slidesPromise, userPromise]).then((data) => {
                console.log(data);
                callback(null, {deckMetaData: JSON.parse(data[0]), slidesData: JSON.parse(data[1]), userData: JSON.parse(data[2])});
            }).catch((err) => {
                console.log(err);
                callback({msg: 'Error in resolving promiese', content: err}, {});
            });

        /*

            let deckRes = rp.get({uri: Microservices.deck.uri + '/deck/' + args.sid});
            let slidesRes = deckRes.then(() => {
                console.log('Inside slidesRes promise');
                return rp.get({uri: Microservices.deck.uri + '/deck/' + args.sid + '/slides'});
            }).catch((err) => {
                callback({msg: 'Error in retrieving deck meta data ' + Microservices.deck.uri + ',', content: err}, {});
            });
            return slidesRes.then(() => {
                console.log('After slidesRes resolved');
                //let data = {deckMetaData: JSON.parse(deckRes.value()), slidesData: JSON.parse(slidesRes.values())};
                console.log(deckRes);
                callback(null, {deckMetaData: JSON.parse(deckRes), slidesData: JSON.parse(slidesRes)});
            }).catch((err) => {
                callback({msg: 'Error in retrieving slides data from ' + Microservices.deck.uri + ' service! Please try again later...', content: err}, {});
            });
        */

            /*
            // Get deck meta data
            rp.get({uri: Microservices.deck.uri + '/deck/' + args.sid})
                .then((deckRes) => {
                    console.log('Deck meta data:', deckRes);

                    // Retrieving slides for the given deck
                    rp.get({uri: Microservices.deck.uri + '/deck/' + args.sid + '/slides'})
                        .then((slidesRes) => {
                            console.log('Slides data:', slidesRes);
                            callback(null, {deckMetaData: JSON.parse(deckRes), slidesData: JSON.parse(slidesRes)});
                        })
                        .catch((err) => {
                            console.log(err);
                            callback({msg: 'Error in retrieving slides data from ' + Microservices.deck.uri + ' service! Please try again later...', content: err}, {});
                        });

                })
                .catch((err) => {
                    console.log(err);
                    callback({msg: 'Error in retrieving deck meta data ' + Microservices.deck.uri + ',', content: err}, {});
                });
                */
                //callback(null, {content: {}, selector: selector, 'page': params.page, 'mode': args.mode});
        }
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            /*
            let sampleContent = `
            <h1>Deck #` + args.sid + `</h1>
            This is a sample deck content. Donec sed odio dui. Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.
            <br/>
            <br/>
            <div class="ui cards segment center aligned">
              <div class="card">
                <div class="content">
                  <div class="header">Slide 1 from ` + args.sid + `</div>
                  <div class="description">
                    Elliot Fu is a film-maker from New York.
                  </div>
                </div>
                <div class="ui bottom attached button">
                  <i class="eye icon"></i>
                  See details
                </div>
              </div>
              <div class="card">
                <div class="content">
                  <div class="header">Slide 2 from ` + args.sid + `</div>
                  <div class="description">
                    Veronika Ossi is a set designer living in New York who enjoys kittens, music, and partying.
                  </div>
                </div>
                <div class="ui bottom attached button">
                  <i class="eye icon"></i>
                  See details
                </div>
              </div>
            </div>
            `;
            callback(null, {content: sampleContent});
            */
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
