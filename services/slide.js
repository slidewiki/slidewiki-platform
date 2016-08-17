import {Microservices} from '../configs/microservices';
import rp from 'request-promise';

export default {
    name: 'slide',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        let selector= {'id': String(args.id), 'spath': args.spath, 'sid': String(args.sid), 'stype': args.stype};
        if(resource === 'slide.content'){
            /*********connect to microservices*************/
            //console.log(Microservices.deck.uri + '/slide/' + selector.sid);
            rp.get({uri: Microservices.deck.uri + '/slide/' + selector.sid}).then((res) => {
            //rp.get({uri: Microservices.deck.uri + '/slide/575060ae4bc68d1000ea952b'}).then((res) => {
                //console.log(res);
                callback(null, {slide: JSON.parse(res), selector: selector, 'page': params.page, 'mode': args.mode});
            }).catch((err) => {
                console.log(err);
                callback(null, {slide: {}, selector: selector, 'page': params.page, 'mode': args.mode});
            });
        }
        if(resource === 'slide.all'){
            /*********connect to microservices*************/
            //console.log(Microservices.deck.uri + '/slide/' + selector.sid);
            rp.get({uri: Microservices.deck.uri + '/allslide'}).then((res) => {
                //console.log(JSON.parse(res));
                //console.log(res);
                callback(null, {slide: JSON.parse(res), selector: selector, 'page': params.page, 'mode': args.mode});
            }).catch((err) => {
                console.log(err);
                callback(null, {slide: {}, selector: selector, 'page': params.page, 'mode': args.mode});
            });
        }
    },
    create: (req, resource, params, body, config, callback) => {
        //TODO get real user id and content name
        const randomUserId = '11223344556677889900000' + String(1 + Math.round(Math.random() * 5));

        let args = params.params? params.params : params;
        //let selector= args.selector;
        //let selector= {'id': String(args.id), 'spath': args.spath, 'sid': String(args.sid), 'stype': args.stype};
        //let slideSpec = {'id': String(args.slideSpec.sid), 'type': args.slideSpec.type};
        if(resource === 'slide.content'){

            //TODO get real content_id
            //const content_id = '112233445566778899000000'.substring(0, 24 - selector.sid.length) + selector.sid;
            const content_id = '112233445566778899000000';
            const root_deck_id = '68';
            /*********connect to microservices*************/
            rp.post({
                uri: Microservices.deck.uri + '/slide/new',
                body:JSON.stringify({
                    //id: args.id,
                    title: args.title,
                    //args.title
                    content: args.content,
                    //TODO
                    speakernotes: args.speakernotes,
                    //args.content
                    //todo: send the right user id
                    //TODO: speaker notes + in object model database in deck microservice
                    user: randomUserId,
                    root_deck: args.deckID,
                    parent_slide: {
                        id: content_id,
                        revision: content_id
                    },
                    position: content_id,
                    language: 'EN',
                    position: content_id,
                    license: 'CC BY-SA'
                })
            }).then((res) => {
                //console.log(JSON.parse(res));
                callback(null, {slide: JSON.parse(res), selector: args.selector});
            }).catch((err) => {
                console.log(err);
                callback(null, {slide: {}, selector: args.selector});
            });

            /*
            from activities
            body:JSON.stringify({
                comment_info: {
                    comment_id: '...',
                    text: args.title
                },
                activity_type: 'comment',
                user_id: randomUserId,
                content_id: content_id,
                content_kind: selector.stype,
                content_name: args.content_name
            })
            //from decservice
            payload: Joi.object().keys({
                      title: Joi.string(),
                      content: Joi.string(),
                      user: Joi.string().alphanum().lowercase(),
                      root_deck: Joi.string().alphanum().lowercase(),
                      parent_slide: Joi.object().keys({
                        id: Joi.string().alphanum().lowercase(),
                        revision: Joi.string().alphanum().lowercase()
                      }),
                      position: Joi.string().alphanum().lowercase().min(0),
                      language: Joi.string(),
                      license: Joi.string().valid('CC0', 'CC BY', 'CC BY-SA')
                    }).requiredKeys('user', 'content', 'root_deck', 'license'),*/
        }
    },
    update: (req, resource, params, body, config, callback) => {
        let args = params.params? params.params : params;
        let selector= {'id': String(args.selector.id), 'spath': args.selector.spath, 'sid': String(args.selector.sid), 'stype': args.selector.stype};
        //console.log('sending update');
        if(resource === 'slide.content'){
          //TODO get real content_id
          //const content_id = '112233445566778899000000'.substring(0, 24 - selector.sid.length) + selector.sid;
            const content_id = '112233445566778899000000';
            const root_deck_id = '68';
            const randomUserId = '11223344556677889900000' + String(1 + Math.round(Math.random() * 5));
            /*********connect to microservices*************/
            rp.put({
                uri: Microservices.deck.uri + '/slide/' + args.id,
                body:JSON.stringify({
                    //id: args.id,
                    title: args.title,
                    //args.title
                    content: args.content,
                    //TODO
                    speakernotes: args.speakernotes,
                    //args.content
                    //todo: send the right user id
                    //TODO: speaker notes + in object model database in deck microservice
                    user: randomUserId,
                    root_deck: args.deckID,
                    parent_slide: {
                        id: content_id,
                        revision: content_id
                    },
                    position: content_id,
                    language: 'EN',
                    position: content_id,
                    license: 'CC BY-SA'
                })
            }).then((res) => {
                //console.log(res);
                //todo:there seems to be an error here: SyntaxError: Unexpected end of JSON input
                //callback(null, {slide: JSON.parse(res), selector: selector});
                callback(null, {slide: {}, selector: selector});
            }).catch((err) => {
                console.log(err);
                callback(null, {slide: {}, selector: selector});
            });
        }
    },
    delete: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        if(resource === 'activities.like'){
            /*********connect to microservices*************/
            //todo
            //rp.delete({
            /*********received data from microservices*************/
            callback(null, {id: args.id});
        }
    }
    // other methods
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
/*
getSlide: function(request, reply) {
  //NOTE shall the response be cleaned or enhanced with values?
  slideDB.get(encodeURIComponent(request.params.id)).then((slide) => {
    if (co.isEmpty(slide))
      reply(boom.notFound());
    else
      reply(co.rewriteID(slide));
  }).catch((error) => {
    request.log('error', error);
    reply(boom.badImplementation());
  });
},

newSlide: function(request, reply) {
  //NOTE shall the response be cleaned or enhanced with values?
  slideDB.insert(request.payload).then((inserted) => {
    //console.log('inserted: ', inserted);
    if (co.isEmpty(inserted.ops) || co.isEmpty(inserted.ops[0]))
      throw inserted;
    else
      reply(co.rewriteID(inserted.ops[0]));
  }).catch((error) => {
    request.log('error', error);
    reply(boom.badImplementation());
  });
},
*/
