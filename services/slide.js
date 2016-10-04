import {Microservices} from '../configs/microservices';
import rp from 'request-promise';

const slidetemplate = 'div class="pptx2html" style="position: relative; width: 960px; height: 720px; background-color: rgb(255, 255, 255); transform: scale(0.84375, 0.84375); transform-origin: left top 0px;">' +
'<div _id="2" _idx="undefined" _name="Titel 1" _type="title" class="block content v-up" style="position: absolute; top: 40.1667px; left: 48.3333px; width: 863.333px; height: 45.3333px; border: 1pt dashed rgb(51, 204, 51); z-index: 193181;">' +
'<div class="h-mid"><span class="text-block" style="color: #000; font-size: 24pt; font-family: Frutiger LT Com 45 Light; font-weight: initial; font-style: normal; text-decoration: initial; vertical-align: ;">O1: Implementation of real-world, large-scale pilots that leverage the power of large-scale collaboration for the creation of inclusive and engaging open content for learning and teaching</span></div>' +
'</div>' +
'<div _id="3" _idx="1" _name="Inhaltsplatzhalter 2" _type="body" class="block content v-up" style="position: absolute; top: 186.167px; left: 48.3333px; width: 863.333px; height: 429.667px; border: 1pt dashed rgb(51, 204, 51); z-index: 193306;">' +
'<div contenteditable="false" id="dragdiv" style="position: absolute; z-index: 9000000; width: 50px; height: 50px;"><img draggable="false" id="imgdrag" src="../../../../../assets/images/cursor_drag_arrow.png" style="z-index: 9000000;" /></div>' +
'' +
'<div class="h-left">&nbsp;</div>' +
'' +
'<ul>' +
'   <li>' +
'   <div class="h-left"><span class="text-block" style="color: #000; font-size: inherit; font-family: Frutiger LT Com 55 Roman; font-weight: initial; font-style: normal; text-decoration: initial; vertical-align: ;">four complementary large-scale pilots, which will test </span><span class="text-block" style="color: #000; font-size: inherit; font-family: Frutiger LT Com 55 Roman; font-weight: initial; font-style: normal; text-decoration: initial; vertical-align: ;">SlideWiki and </span><span class="text-block" style="color: #000; font-size: inherit; font-family: Frutiger LT Com 55 Roman; font-weight: initial; font-style: normal; text-decoration: initial; vertical-align: ;">associated tools, solutions and services in different geographic regions, organizational units and institutions in different teaching and learning scenarios</span><span class="text-block" style="color: #000; font-size: inherit; font-family: Frutiger LT Com 55 Roman; font-weight: initial; font-style: normal; text-decoration: initial; vertical-align: ;">.</span></div>' +
'   </li>' +
'   <li>' +
'   <div class="h-left"><span class="text-block" style="color: #000; font-size: inherit; font-family: Frutiger LT Com 55 Roman; font-weight: bold; font-style: normal; text-decoration: initial; vertical-align: ;">Professional &amp; vocational training pilot</span><span class="text-block" style="color: #000; font-size: inherit; font-family: Frutiger LT Com 55 Roman; font-weight: initial; font-style: normal; text-decoration: initial; vertical-align: ;">(Greece, Germany, Spain and others)</span><span class="text-block" style="color: #000; font-size: inherit; font-family: Frutiger LT Com 55 Roman; font-weight: bold; font-style: normal; text-decoration: initial; vertical-align: ;">. </span><span class="text-block" style="color: #000; font-size: inherit; font-family: Frutiger LT Com 55 Roman; font-weight: initial; font-style: normal; text-decoration: initial; vertical-align: ;">In this trial we will target professional and vocational training audiences in particular continuing education and part-time training for people in employment. We will engage with trainers and educators in this crucial </span><span class="text-block" style="color: #000; font-size: inherit; font-family: Frutiger LT Com 55 Roman; font-weight: initial; font-style: normal; text-decoration: initial; vertical-align: ;">education domain. Particular emphasis in this pilot will be on training for learners with physical, sensory and cognitive disabilities and impairments.</span></div>' +
'   </li>' +
'   <li>' +
'   <div class="h-left"><span class="text-block" style="color: #000; font-size: inherit; font-family: Frutiger LT Com 55 Roman; font-weight: bold; font-style: normal; text-decoration: initial; vertical-align: ;">Higher-Education pilot</span><span class="text-block" style="color: #000; font-size: inherit; font-family: Frutiger LT Com 55 Roman; font-weight: initial; font-style: normal; text-decoration: initial; vertical-align: ;">(UK, Germany, Netherlands, Switzerland, Spain, Greece and others)</span><span class="text-block" style="color: #000; font-size: inherit; font-family: Frutiger LT Com 55 Roman; font-weight: bold; font-style: normal; text-decoration: initial; vertical-align: ;">. </span><span class="text-block" style="color: #000; font-size: inherit; font-family: Frutiger LT Com 55 Roman; font-weight: initial; font-style: normal; text-decoration: initial; vertical-align: ;">The higher-education trial </span><span class="text-block" style="color: #000; font-size: inherit; font-family: Frutiger LT Com 55 Roman; font-weight: initial; font-style: normal; text-decoration: initial; vertical-align: ;">will be </span><span class="text-block" style="color: #000; font-size: inherit; font-family: Frutiger LT Com 55 Roman; font-weight: initial; font-style: normal; text-decoration: initial; vertical-align: ;">performed at the partnering and associated academic institutions. In the spirit of the proverb &ldquo;practice what you preach&rdquo;, each academic partner institution will employ the developed tools, services and solutions based on the SlideWiki platform for several courses at their respective institution.</span></div>' +
'   </li>' +
'   <li>' +
'   <div class="h-left"><span class="text-block" style="color: #000; font-size: inherit; font-family: Frutiger LT Com 55 Roman; font-weight: bold; font-style: normal; text-decoration: initial; vertical-align: ;">Secondary Education Schools pilot</span><span class="text-block" style="color: #000; font-size: inherit; font-family: Frutiger LT Com 55 Roman; font-weight: initial; font-style: normal; text-decoration: initial; vertical-align: ;">(Italy, Germany, Spain and others)</span><span class="text-block" style="color: #000; font-size: inherit; font-family: Frutiger LT Com 55 Roman; font-weight: bold; font-style: normal; text-decoration: initial; vertical-align: ;">. </span><span class="text-block" style="color: #000; font-size: inherit; font-family: Frutiger LT Com 55 Roman; font-weight: initial; font-style: normal; text-decoration: initial; vertical-align: ;">In this trial we focus on the creation and use of learning material for science, technology, engineering and mathematics (STEM) education in secondary schools. Emp</span><span class="text-block" style="color: #000; font-size: inherit; font-family: Frutiger LT Com 55 Roman; font-weight: initial; font-style: normal; text-decoration: initial; vertical-align: ;">hasis will be on learning material for the Roberta learning with robots initiative and citizen science education.</span></div>' +
'   </li>' +
'   <li>' +
'   <div class="h-left"><span class="text-block" style="color: #000; font-size: inherit; font-family: Frutiger LT Com 55 Roman; font-weight: bold; font-style: normal; text-decoration: initial; vertical-align: ;">MOOC and Open Community Education pilot</span><span class="text-block" style="color: #000; font-size: inherit; font-family: Frutiger LT Com 55 Roman; font-weight: initial; font-style: normal; text-decoration: initial; vertical-align: ;">(Europe and worldwide). In this pilot we aim to attain the widest possible reach, by engaging with learners from all over Europe participating in MOOC and open education projects by our partners FutureLearn, OpenCast and Open Knowledge Foundation.</span></div>' +
'   </li>' +
'</ul>' +
'' +
'<div contenteditable="false" id="resizediv" style="position: absolute; width: 50px; height: 50px; z-index: 9000000; left: 793px; top: 379px;"><img contenteditable="false" draggable="false" id="imgresize" src="../../../../../assets/images/cursor_resize_arrow.png" style="position: absolute; z-index: 9000000;" /></div>' +
'</div>' +
'</div>';


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
                //console.log('From slide service:', res);
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
    /*
        For now hardcoded slide template - powerpoint basic slide
    */
    create: (req, resource, params, body, config, callback) => {
        //TODO get real content name
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
                uri: Microservices.deck.uri + '/slide/new',
                body:JSON.stringify({
                    //id: args.id,
                    title: args.title,
                    //args.title
                    //content: args.content,
                    content: slidetemplate,
                    //TODO
                    speakernotes: args.speakernotes,
                    //args.content
                    //TODO: speaker notes + in object model database in deck microservice
                    user: args.userid.toString(),
                    root_deck: args.root_deck,
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
                    //TODO: speaker notes + in object model database in deck microservice
                    user: args.userid.toString(),
                    root_deck: args.root_deck,
                    top_root_deck: selector.id,
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
                let changeset = null;
                //console.log(resParse);
                if(resParse.hasOwnProperty('changeset')){
                    changeset = resParse.changeset;
                    //changeset.new_revisions.reverse();
                    //console.log('new rev', changeset.new_revisions);
                    let j = 0;
                    if(changeset.new_revisions[0].hasOwnProperty('root_changed')){
                        j = 1;
                        selector.id = changeset.new_revisions[0].root_changed;
                    }
                    //console.log('old path array', pathArr);
                    for(let i = 0; i < pathArr.length; i++){
                        if(j < changeset.new_revisions.length && pathArr[i].split(':')[0].split('-')[0] === changeset.new_revisions[j].split('-')[0]){
                            pathArr[i] = pathArr[i].split(':')[0].split('-')[0]+'-'+changeset.new_revisions[j].split('-')[1]+':'+pathArr[i].split(':')[1];
                            j++;
                        }

                    }
                    //console.log('new path array', pathArr);
                    selector.spath = pathArr;

                }

                callback(null, {slide: {id: newSlideID, path: pathArr.join(';')}, selector: selector, changeset: changeset});
            }).catch((err) => {
                console.log(err);
                callback(null, {slide: {id: newSlideID, path: pathArr.join(';')}, selector: selector});
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
