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
            let contents;


            phantom.create().then((instance) => {
                phInstance = instance;
                return instance.createPage();
            }).then((page) => {
                page.setContent(args.contentHTML,'/slide/' + arg.sid);
                webPage = page;
                return page.renderBase64('PNG');
            }).then((src) => {
                webPage.close();
                phInstance.exit();
                res.render('users',{title: 'Users',
                imgSrc: 'data:image/png;charset=utf-8;base64,'+ src});
                contents = 'src:' + imgSrc;
                callback(null, {contents: contents, selector: selector});

            }).catch((error) => {
                callback(error, {contents: contents, selector: selector});
                phInstance.exit();
            });


        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
