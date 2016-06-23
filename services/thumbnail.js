import phantom from 'phantom';

export default {
    name: 'thumbnail',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        let selector= {'sid': args.sid};
        if(resource === 'thumbnail.htmlcontent'){ //html code is provided
            let imgSrc;
            let webPage;
            let phInstance;

            phantom.create().then((instance) => {
                phInstance = instance;
                return instance.createPage();
            }).then((page) => {
                page.setContent(args.contentHTML,'/slide/' + args.sid);
                webPage = page;
                return page.renderBase64('PNG');
            }).then((src) => {
                webPage.close();
                phInstance.exit();
                imgSrc= 'data:image/png;charset=utf-8;base64,'+ src;
                callback(null, {contents: {'src': imgSrc}, selector: selector});

            }).catch((error) => {
                callback(error, {contents: {'src': {}}, selector: selector});
                phInstance.exit();
            });


        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
