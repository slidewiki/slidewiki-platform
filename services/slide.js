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
            /*********connect to microservices*************/
            rp.post({
                uri: Microservices.deck.uri + '/slide/create',
                body:JSON.stringify({
                    title: 'test_insert_title',
                    //args.title
                    content: 'test_insert_content',
                    //args.content
                    //todo: send the right user id
                    user: randomUserId,
                    root_deck: 'test_insert_title',
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
        if(resource === 'activities.like'){
            /*********connect to microservices*************/
            //todo
            //rp.put({
            /*********received data from microservices*************/
            callback(null, {id: args.id});
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
/*
        if(resource === 'slide.content'){
            /*********connect to microservices*************/
            //TODO (also in store) - objects in slides - see discussion on JIRA -
            //for example; slide title, content, speaker notes, internal embeded objects (images, videos, sound, flash, etc..)
            /*********received data from microservices*************/
/*
            let sampleContent = `
            <h1> Slide #` + args.sid + `</h1>
            <div>
                <p style="font-size: 1.16em;">
                    Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. Donec id elit non mi porta gravida at eget metus.
                </p>
                <ul>
                    <li>item 1 from slide ` + args.sid + `</li>
                    <li>item 2 from slide ` + args.sid + `</li>
                    <li>item 3 from slide ` + args.sid + `</li>
                </ul>
                <p style="font-size: 1.2em;">
                    Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.
                </p>
                <p style="text-align:center">
                    <svg xmlns="http://www.w3.org/2000/svg"
                         xmlns:xlink="http://www.w3.org/1999/xlink">
                        <text x="20"  y="40"
                              style="font-family: Arial;
                                     font-size  : 25;
                                     stroke     : #000000;
                                     fill       : #` +((1<<24)*Math.random()|0).toString(16) + `;
                                    "
                              > SVG Image ` + args.sid + `</text>
                    </svg>
                </p>
            </div>
            `;
            callback(null, {content: sampleContent});
        }
    }
*/
