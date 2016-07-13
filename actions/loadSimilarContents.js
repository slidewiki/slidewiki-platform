import {shortTitle} from '../configs/general';
import getSlideThumbnail from './getSlideThumbnail';

function getSlideContent(sid){
    let sampleContent = `
  <html>
  <head>
    <link href="/custom_modules/custom-semantic-ui/dist/semantic.min.css" rel="stylesheet" type="text/css" />
  </head>
  <body>
  <h1>Deck #` + sid + `</h1>
  This is a sample deck content. Donec sed odio dui. Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.
  <br/>
  <br/>
  <div class="ui cards segment center aligned">
    <div class="card">
      <div class="content">
        <div class="header">Slide 1 from ` + sid + `</div>
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
        <div class="header">Slide 2 from ` + sid + `</div>
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
  </body>
  </html>
  `;

    return sampleContent;

}

export default function loadSimilarContents(context, payload, done) {
    context.service.read('similarcontent.list', payload, {timeout: 30 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('LOAD_SIMILAR_CONTENT_FAILURE', err);
        } else {


            for(let i=0; i< res.contents.length;i++){
             //TODO: get the htmlContent from slide service.
                let contentHTML = getSlideContent(res.contents[i].id);
                context.service.read('thumbnail.htmlcontent', {sid: res.contents[i].id, contentHTML : contentHTML}, {timeout: 30 * 1000}, (errThumb, resThumb) => {
                    if(errThumb){
                        context.dispatch('LOAD_SIMILAR_CONTENT_FAILURE', errThumb);
                    } else{
                        res.contents[i].imgSrc = resThumb.contents.src;
                        context.dispatch('LOAD_SIMILAR_CONTENT_SUCCESS', res);
                    }
                });
              //context.executeAction(getSlideThumbnail,{sid:id, contentHTML: contentHTML},done);
            }

        }
        let pageTitle = shortTitle + ' | Similar Content | ' + payload.params.stype + ' | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
