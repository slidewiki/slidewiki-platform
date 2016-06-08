export default {
    name: 'presentation',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        //let selector= {'id': args.id, 'spath': args.spath, 'sid': args.sid, 'stype': args.stype, 'mode': args.mode};
        //Load the whole presentation
        if(resource === 'presentation.content'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/

            let deck = args.deck;
            let presentation = [];
            for (var slide in deck) {
              console.log("slide id: ", slide);
              presentation.push({'id': slide['id'], 'content': get_sample_text(slide['id'])});
            }

            callback(null, {content: presentation});
        }
    },



    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};


function get_sample_text(id){
  return `
  <h1> Slide #` + id + `</h1>
  <div>
      <p style="font-size: 1.16em;">
          Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. Donec id elit non mi porta gravida at eget metus.
      </p>
      <ul>
          <li>item 1 from slide ` + id + `</li>
          <li>item 2 from slide ` + id + `</li>
          <li>item 3 from slide ` + id + `</li>
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
                    > SVG Image ` + id + `</text>
          </svg>
      </p>
  </div>
  `;
}
