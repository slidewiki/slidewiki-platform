import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;



export default {
    name: 'slide',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;
        let selector= {'id': String(args.id), 'spath': args.spath, 'sid': String(args.sid), 'stype': args.stype};
        if(resource === 'slide.content'){
            /*********connect to microservices*************/
            rp.get({uri: Microservices.deck.uri + '/slide/' + selector.sid}).then((res) => {
            //rp.get({uri: Microservices.deck.uri + '/slide/575060ae4bc68d1000ea952b'}).then((res) => {
                //console.log('From slide Service:', res);
                callback(null, {slide: JSON.parse(res), selector: selector, 'page': params.page, 'mode': args.mode});
            }).catch((err) => {
                //console.log(err);
                callback(null, {slide: {}, selector: selector, 'page': params.page, 'mode': args.mode});
            });
        }
        if(resource === 'slide.all'){
            /*********connect to microservices*************/
            rp.get({uri: Microservices.deck.uri + '/allslide'}).then((res) => {
                callback(null, {slide: JSON.parse(res), selector: selector, 'page': params.page, 'mode': args.mode});
            }).catch((err) => {
                console.log(err);
                callback(null, {slide: {}, selector: selector, 'page': params.page, 'mode': args.mode});
            });
        }
    },
    /*
        For now hardcoded slide template - powerpoint basic slide
    */
    create: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'create', Method: req.method});
        //TODO get real content name
        let args = params.params? params.params : params;
        log.info('slide service: args', args);
        console.log('slide service: args', args);
        req.log('slide service: args', args);
        //let selector= args.selector;
        //let selector= {'id': String(args.id), 'spath': args.spath, 'sid': String(args.sid), 'stype': args.stype};
        //let slideSpec = {'id': String(args.slideSpec.sid), 'type': args.slideSpec.type};
        if(resource === 'slide.content'){
            //TODO check if the attributes where content_id is used could be removed here (seems to be not regarded in deckservice 17/4/13)
            //TODO get real content_id
            //const content_id = '112233445566778899000000'.substring(0, 24 - selector.sid.length) + selector.sid;
            const content_id = '112233445566778899000000';
            /*********connect to microservices*************/
            rp.post({
                uri: Microservices.deck.uri + '/slide/new',
                headers: {'----jwt----': args.jwt},
                body:JSON.stringify({
                    //id: args.id,
                    title: args.title,
                    //args.title
                    content: args.content? args.content: ' ',
                    //content: slidetemplate,
                    //TODO
                    speakernotes: args.speakernotes?
                        args.speakernotes: ' ',
                    //args.content
                    //TODO: speaker notes + in object model database in deck microservice
                    root_deck: args.root_deck,
                    parent_slide: {
                        id: content_id,
                        revision: content_id
                    },
                    theme: args.selector.theme,
                    position: content_id,
                    language: 'EN',
                    license: 'CC BY-SA',
                    tags: []
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
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'update', Method: req.method});
        let args = params.params? params.params : params;
        let selector= {'id': String(args.selector.id), 'spath': args.selector.spath, 'sid': String(args.selector.sid), 'stype': args.selector.stype};

        if(resource === 'slide.content'){
            //TODO check if the attributes where content_id is used could be removed here (seems to be not regarded in deckservice 17/4/13)
            //TODO get real content_id
            //const content_id = '112233445566778899000000'.substring(0, 24 - selector.sid.length) + selector.sid;
            const content_id = '112233445566778899000000';
            /*********connect to microservices*************/
            let url = Microservices.deck.uri + '/slide/' + args.id;
            log.info('slide.content args.theme', args.theme);
            rp.put({
                uri: url,
                headers: {'----jwt----': args.jwt},
                body:JSON.stringify({
                    //id: args.id,
                    title: args.title,
                    //args.title
                    content: args.content? args.content: ' ',
                    //TODO
                    speakernotes: args.speakernotes? args.speakernotes: ' ',
                    //args.content
                    //TODO: speaker notes + in object model database in deck microservice
                    root_deck: args.root_deck,
                    top_root_deck: selector.id,
                    parent_slide: {
                        id: content_id,
                        revision: content_id
                    },
                    theme: args.theme,
                    position: content_id,
                    language: 'EN',
                    dataSources: args.dataSources,
                    license: 'CC BY-SA',
                    tags: (args.tags && (args.tags instanceof Array)) ? args.tags : []
                })
            }).then((res) => {
                let resParse = JSON.parse(res);
                let newSlideID = resParse._id + '-'+resParse.revisions[0].id;
                //update the path for new slide revision
                let path = selector.spath;
                let pathArr = path.split(';');
                if(pathArr.length){
                    let lastPath = pathArr[pathArr.length-1];
                    let lastPathPosition = lastPath.split(':')[1];
                    pathArr[pathArr.length-1] = newSlideID + ':' + lastPathPosition;
                }else{
                    pathArr=[];
                }
                callback(null, {slide: {id: newSlideID, path: pathArr.join(';')}, selector: selector});
            }).catch((err) => {
                console.log(err);
                callback(err);
            });
        }
    },
    delete: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'delete', Method: req.method});
        let args = params.params? params.params : params;
        if(resource === 'activities.like'){
            /*********connect to microservices*************/
            //todo
            //rp.delete({
            /*********received data from microservices*************/
            callback(null, {id: args.id});
        }
    }
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
