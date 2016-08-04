import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const util = require('util');


//add interface/API to get file from front-end react-dropzone. Get from components/import/FileUploader.js or Import.js
// ADD SERVICE IN ROUTE.JS TO GET URL!??!
//context.service.create('import.content', payload, {timeout: 20 * 1000}, (err, res) => {
//    if (err) {
//        context.dispatch('LOAD_IMPORT_FILE_FAILURE', err);
//    } else {
        //console.log(res);
//        context.dispatch('LOAD_IMPORT_FILE_SUCCESS', res);
//    }
    //let pageTitle = shortTitle + ' | Import presentation | ' + payload.params.stype + ' | ' + payload.params.sid;
    //context.dispatch('UPDATE_PAGE_TITLE', {
        //pageTitle: pageTitle
    //});
//    done();

export default {
    name: 'import',
    // At least one of the CRUD methods is Required
    //read: (req, resource, params, config, callback) => {
    create: (req, resource, params, body, config, callback) => {
        let args = params.params? params.params : params;
        if(resource === 'import.content'){
            console.log(body);
            console.log(params);
            let file = params.file;
            console.log(file);
            console.log(util.inspect(file, {showHidden: false, depth: null}));
            console.log(util.inspect(params.file, false, null));
            let file2 = params;
            console.log('parameters' + file2);
            console.log(util.inspect(file2, {showHidden: false, depth: null}));
            let file3 = args.file;
            console.log('parameters' + file3);
            console.log(util.inspect(file3, {showHidden: false, depth: null}));
            let file4 = args;
            console.log('parameters' + file4);
            console.log(util.inspect(file4, {showHidden: false, depth: null}));
            //console.log('length: ' + Buffer.byteLength(file));
            //console.log('length: ' + file.length); does not work
            /*********connect to microservices*************/
            //todo
            //working dir Dropbox/pptx
            //console.log('testservice' + args.file);
            /*********connect to microservices*************/
            //TODO - HEADER/MULTIPART THING -> application/vnd.openxmlformats-officedocument.presentationml.presentation
            rp.post({
                uri: Microservices.import.uri + '/importPPTX',
                //headers: 'Content-Type: application/vnd.openxmlformats-officedocument.presentationml.presentation',
                    //'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                headers: {
                    //'Content-Type: application/vnd.openxmlformats-officedocument.presentationml.presentation'
                    //'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                    //,
                    'Content-Type': 'application/x-www-form-urlencoded'
                    //,'Content-Length': Buffer.byteLength(file)
                    //,'Content-Length': 71066
                },
                //body:JSON.stringify({
                //    file: args.file
                //})
                //body: {
                //    file: params.file
                //}
                form: JSON.stringify({
                    file: params.file,
                    filename: 'one_slide_overview_content_revisioning.pptx',
                    //filename: params.file.name,
                    //contentType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                    contentType: 'multipart/form-data'
                })
                //data: params.file,
                //body: args.file,
                //body: 'test',
                //body: params.file,
                //content: file,
                //body: {file: file}
                //data: params.file,
                //data: file
                //content: file
                //File: file
                //data: 'testtesttest',
                //body: 'testtesttest',
                //HEADER MULTIPART!
            }).then((res) => {
                console.log('result of call to import-microservice' + res); //can comment when it is ready
                //console.log(JSON.parse(res)); //can comment when it is ready
                callback(null, {htmlConvert: res});
            }).catch((err) => {
                console.log(err);
                callback(null, {htmlConvert: {}, file: args.file});
            });

            /**********************/
            //option 1 - UNOCONV - https://github.com/dagwieers/unoconv - written in Python. (http://dag.wiee.rs/home-made/unoconv/)
            // Several node.js WRAPPERS -> https://www.npmjs.com/search?q=unoconv -> "Unoconv is required, which requires LibreOffice (or OpenOffice.)" still needs UNOCONV installation on webserver -> is not optimal solution!
            //docker Webservice (good -> microservice + does not need UNOCONV on server): https://github.com/zrrrzzt/docker-unoconv-webservice

            // GOOD FOR CONVERTING ODP TO PPTX!! (Then use PPTX2HTML library (see option 6))

            //installation of docker webserivce by Ben.
            //TESTS:
            //   curl --form file=@myfile.docx http://manfredfris.ch:6000/unoconv/pdf > myfile.pdf
            // curl --form file=@myfile.pptx http://manfredfris.ch:6000/unoconv/html5 > myfile.html
            // curl --form file=@myfile.odp http://manfredfris.ch:6000/unoconv/xhtml > myfile.html -> 500 error
            // curl --form file=@myfile.pptx http://manfredfris.ch:6000/unoconv/html > myfile.html  -> 0 bytes output
            // curl --form file=@myfile.odp http://manfredfris.ch:6000/unoconv/html > myfile.html -> -0 bytes output
            // curl --form file=@myfile.ppt http://manfredfris.ch:6000/unoconv/html > myfile.html -> -0 bytes output
            // curl --form file=@myfile.docx http://manfredfris.ch:6000/unoconv/html > myfile.html -> works
            // curl --form file=@myfile.ppt http://manfredfris.ch:6000/unoconv/xhtml > myfile.xml -> 500 error
            // curl --form file=@myfile.pptx http://manfredfris.ch:6000/unoconv/doc > myfile.doc
            // curl --form file=@myfile.ppt http://manfredfris.ch:6000/unoconv/xhtml > myfile.html -> 500 error
            // curl --form file=@myfile.pptx http://manfredfris.ch:6000/unoconv/xhtml > myfile.html -> does seem to work partially
            // curl --form file=@myfile.odp http://manfredfris.ch:6000/unoconv/xhtml > myfile.html -> works -> non reproducable?
            // curl --form file=@myfile.ppt http://manfredfris.ch:6000/unoconv/text > myfile.txt
            // curl --form file=@myfile.pdf http://manfredfris.ch:6000/unoconv/uop > myfile.uop
            // curl --form file=@myfile.odp http://manfredfris.ch:6000/unoconv/pdf > myfile.pdf

            //Not clear what conversions are possible from http://dag.wiee.rs/home-made/unoconv/

            //Export to HTML does not work -> are multiple files -> need to rewrite Webservice (see my question to author of unoconv webservice https://github.com/zrrrzzt/docker-unoconv-webservice/issues/2)
            //export to XHMTML does work -> However, Lot of information (layout, colours, drawings) is lost. Transistion between HTML of one slide and another is unclear. Images as Base64 -> is ok (needs convertion + storage)

            // Needs Unoconv output filter??
            //https://github.com/dagwieers/unoconv/blob/master/doc/filters.adoc
            // https://github.com/dagwieers/unoconv/blob/master/doc/unoconv.1.adoc

            //TEST using openoffice GUI client desktop installation - 21-06-2016
            // Tried various HTML export (from ODT) are all crap - position of text is lost. Pictures are lost.
            // UNOCONV does not seem good...

            /**********************/
            //OPTION 2:
            // use current docker unoconv webservice (https://github.com/zrrrzzt/docker-unoconv-webservice) to conver to PDF
            // + together with good PDF to HTML conversion library - pdf2htmlEX - is very popular
            // http://coolwanglu.github.io/pdf2htmlEX/ starred by 5000 people
            // https://github.com/coolwanglu/pdf2htmlEX/wiki/Use-Cases
            // https://github.com/coolwanglu/pdf2htmlEX/wiki/Building
            // Also see https://github.com/coolwanglu/pdf2htmlEX/wiki/Comparison
            // https://www.npmjs.com/package/pdftohtmljs
            // NEEDS more research - HTML is bloated + image of whole captured thing is saved..
            // Not a good solution for now
            /**********************/
            //Option 4 - Use google deck/slide import/export service?? (if it exist) However, not open! 3th party dependency! can change anytime -> preferably not!
            /**********************/
            //option 5 - use existing Slidewiki implementation? Is in PHP! need to convert to ES6. https://github.com/AKSW/SlideWiki/tree/master/slidewiki/libraries/backend/pptxImporter
            /**********************/
            //option 6 - use (an)other libraries
            //https://www.npmjs.com/package/office2html (unoconv) (related to option 1 - has disadvantages)
            //https://www.npmjs.com/package/office-converter (unoconv) (related to option 1 - has disadvantages)
            //https://www.npmjs.com/package/office (unoconv) (related to option 1 - has disadvantages)

            //CHOSEN FOR NOW:
            //https://github.com/g21589/PPTX2HTML -> works well -> see Demo - http://g21589.github.io/PPTX2HTML/ -> very fast (1 seconds for large presentation with images and many drawings)
            //images/figures as SVG or base64 export -> seems good -> better than Unoconv

            //written in PURE JAVASCRIPT -> TODO -> convertion to ES6? or use as bower service? Make component Seems like a lot of potential server-side scripting -> we could improve performance...

            //export uses bootstrap CSS (good for accessibility) and own CSS (not much though, not megabytes of bloatcode like PDF -> HTML) -> interesting CKEDITOR bootstrap plugin: http://albatrossdigital.github.io/widgetbootstrap/
            //TODO: needs adaptation to make CSS/Layout/positioning suitable for CKeditor + our platform -> positioning of elements is now relative to size of export (e.g. 800*600 slides) We need some way to keep the SVG drawings saved (or the will be scrambled)
            //TODO: IN CKEDITOR  - Change how CKEDITOR removes unwanted/unsupported HTML tags!
            //TODO: Feedback Abi: Alt tages for images
            //TODO (low prio):
            //Do we use templates? Can we use an import template
            //TODO research: CK editor plugin for importing relative/absolute positioning of elements? http://ckeditor.com/addon/divarea and/or http://ckeditor.com/demo#widgets (simple box - is already in full download or do we need to add this plugin?)
            // TODO import speaker notes

            //Abi Evaluation:
            //  tried the example site at http://g21589.github.io/PPTX2HTML/ with a couple of pretty complex presentations. Most content was ok but there would be some areas we need to improve:
            //    alt tags on images are not imported
            //    maths equations are not imported (both MathType objects and OMML)
            //    SmartArt diagrams and other visual objects (Excel graphs in paticular) are lost or distorted
            //    audio and video embedded in slides

            //change export to 1024*768? or scalable / relative? -> now export assumes certain format of slides?!

            // Images is base64 ->data:image/jpeg;base64 -> needs converting + storage (we need image upload anyway)

            //we need SVG editor for drawing objects in PPTX slides
            /**********************/
            // option 7 - use SaaS/provider of convertion - documentalchemy, asposeslidescloud, http://conaito.com/products/powerpoint-to-html5-sdk, etc... cost money + is dependency -> not good solution
            /**********************/
            //option 8 - implement myself - PPTX is zip file with HTML - takes a lot of time -> combine with option 5
            /*********received data from microservices*************/

        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
