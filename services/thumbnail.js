import phantom from 'phantom';

export default {
    name: 'thumbnail',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        let selector= {'sid': args.sid};
        console.log('entra en el servici');
        if(resource === 'thumbnail.htmlcontent'){ //html code is provided
            let imgSrc;
            let webPage;
            let phInstance;
            let contents;

            //TODO: get the htmlContent from slide service.
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
            phantom.create().then((instance) => {
                phInstance = instance;
                return instance.createPage();
            }).then((page) => {
                page.setContent(sampleContent,'/slide/' + arg.sid);
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
