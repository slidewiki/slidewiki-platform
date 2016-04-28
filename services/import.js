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
                 <h1 className="ui header">Upload in progress. Once finished you will be redirected to the imported presentation</h1>
                 <br />
                 <p> TODO - Loading bar - mock-up random. See example in slidecontrol.js </p>
                 <br />
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
