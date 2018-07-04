import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'lti',
    // At least one of the CRUD methods is Required
    /*
        For now hardcoded slide template - powerpoint basic slide
    */
    create: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'create', Method: req.method});
        //TODO get real content name
        let args = params.params? params.params : params;
        console.log('test');


        //let selector= args.selector;
        //let selector= {'id': String(args.id), 'spath': args.spath, 'sid': String(args.sid), 'stype': args.stype};
        //let slideSpec = {'id': String(args.slideSpec.sid), 'type': args.slideSpec.type};
        if(resource === 'lti'){
            const content_id = '112233445566778899000000';
            console.log(params);
            /*********connect to microservices*************/
            /*
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
              */

        }
    }

};
