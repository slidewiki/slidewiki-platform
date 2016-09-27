import {Microservices} from '../configs/microservices';
import rp from 'request-promise';

export default {
    name: 'deck',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params ? params.params : params;
        if (resource === 'deck.content') {
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
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
        } else if (resource === 'deck.properties') {
            let deckPromise = rp.get({uri: Microservices.deck.uri + '/deck/' + args.sid}).promise().bind(this);
            let editorsPromise = rp.get({uri: Microservices.deck.uri + '/deck/' + args.sid + '/editors'}).promise().bind(this);
            Promise.all([deckPromise, editorsPromise]).then((res) => {
                let deck = JSON.parse(res[0]), editors = JSON.parse(res[1]);
                let revision;
                //if deck's sid does not specify revision, find the active revision from the corresponding field
                if (args.sid.split('-').length < 2) {
                    revision = deck.revisions.find((rev) => {
                        return rev.id === deck.active;
                    });
                } else {
                    revision = deck.revisions[0];
                }
                let deckProps = {
                    description: revision.description != null ? revision.description : deck.description,
                    language: deck.language,
                    tags: revision.tags != null ? revision.tags : deck.tags,
                    title: revision.title != null ? revision.title : deck.title,
                    license: revision.license != null ? revision.license : deck.license
                };
                callback(null, {
                    deckProps: deckProps,
                    editors: editors
                });
            }).catch((err) => {
                callback(err);
            });
        } else if (resource === 'deck.numberofslides') {
            let args = params.params ? params.params : params;
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

        if (resource === 'deck.create') {
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
                license: params.license
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
        if (resource === 'deck.update') {
            if (params.tags.length === 1 && params.tags[0].length === 0)
                params.tags = undefined;
            let toSend = {
                description: params.description ? params.description : 'empty',
                language: params.language,
                tags: params.tags,
                title: params.title,
                user: params.userid.toString(),
                license: params.license,
                new_revision: false
            };
            rp({
                method: 'PUT',
                uri: Microservices.deck.uri + '/deck/' + params.deckId,
                json: true,
                body: toSend
            }).then((deck) => callback(false, deck))
            .catch((err) => callback(err));
            //update a deck by creating a new revision and setting it as active
        } else if (resource === 'deck.updateWithRevision') {
            if (params.tags.length === 1 && params.tags[0].length === 0)
                params.tags = undefined;
            let toSend = {
                description: params.description ? params.description : 'empty',
                language: params.language,
                tags: params.tags,
                title: params.title,
                user: params.userid.toString(),
                license: params.license,
                new_revision: true
            };
            if (params.root_deck != null) {
                toSend.root_deck = params.root_deck;
            }
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