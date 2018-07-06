import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'lti',
    // At least one of the CRUD methods is Required
    /*
        For now hardcoded slide template - powerpoint basic slide
    */
    create: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'create', Method: req.method});
        console.log(params);
        console.log("params.ltiURL="+params.ltiURL);
        var url = params.ltiURL;
        // LTI paramters
        var args = params.params? params.params : params;

        if(resource === 'lti'){
            /*********connect to LTI Provider*************/
            rp.post({
              uri: url,
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              body:JSON.stringify(args)
          }).then((res) => {
              console.log("lti.res=");
              //console.log(res);
              //console.log(JSON.stringify(res));
              callback(null, res);
          }).catch((err) => {
              //console.error(err);
              callback(err);
          });

        }
    }

};
