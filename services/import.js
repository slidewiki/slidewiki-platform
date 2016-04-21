 export default {
     name: 'import',
     // At least one of the CRUD methods is Required
     read: (req, resource, params, config, callback) => {
         let args = params.params? params.params : params;
         if(resource === 'import.content'){
             /*********connect to microservices*************/
             //todo
             /*********received data from microservices*************/
             let sampleImportFile = `
             <div className="ui content">
                 <br />
                 <br />
                 <h1 className="ui header">Preview of imported presentation</h1>
                 <br />
                 <br />
             </div>             
             <h1> Slide #IMPORT_EXAMPLE</h1>
             <div>
                 <p style="font-size: 1.16em;">
                     Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. Donec id elit non mi porta gravida at eget metus.
                 </p>
                 <ul>
                     <li>item 1 from slide IMPORT_EXAMPLE</li>
                     <li>item 2 from slide IMPORT_EXAMPLE</li>
                     <li>item 3 from slide IMPORT_EXAMPLE</li>
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
                               > SVG Image IMPORT_EXAMPLE</text>
                     </svg>
                 </p>
             </div>
             `;
             callback(null, {content: sampleImportFile});
         }
     }
     // other methods
     // create: (req, resource, params, body, config, callback) => {},
     // update: (req, resource, params, body, config, callback) => {}
     // delete: (req, resource, params, config, callback) => {}
 };
