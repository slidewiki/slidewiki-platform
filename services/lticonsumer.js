import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'lticonsumer',
    // At least one of the CRUD methods is Required
    /*
        For now hardcoded slide template - powerpoint basic slide
    */
    create: (req, resource, params, body, config, callback) => {
        //console.log("service/lticonsumer.js/resource="+resource);

        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'create', Method: req.method});
        //console.log('params='+params);
        //console.log("params.ltiURL="+params.ltiURL);
        var ltiURL = params.ltiURL;
        var ltiKey = params.ltiKey;
        var ltiHeight = params.ltiHeight;
        var ltiWidth = params.ltiWidth;

        // LTI paramters
        var args = params.params? params.params : params;

        var url = require('url');
        var http = require('http');
        var https = require('https');
        var request = require('request');
        var querystring = require('querystring');
        var btoa = require("btoa");
        var oauth = require('oauth-sign');
        var fs = require("fs");

        var parseURL = url.parse(ltiURL, true);
        var hostname = parseURL.hostname;
        var port = parseURL.port;
        var pathname = parseURL.pathname;

        //console.log('hostname='+hostname);
        //console.log('path='+pathname);
        //console.log('port='+port);

        if(resource === 'lticonsumer'){
            /*********connect to LTI Provider*************/
          var post_data = querystring.stringify(args);
          //console.log('lticonsumer.js.args='+JSON.stringify(args));
          var request_options = {
            hostname:  hostname,
            path: pathname,
            port: port,
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          };

          var body = '';
          //console.log('Setting up req');
          //console.log('request_options='+JSON.stringify(request_options));
          //console.log('post_data='+JSON.stringify(post_data));
          var req = http.request(request_options, function(res) {
          console.log('STATUS: ' + res.statusCode);
          console.log('HEADERS: ' + JSON.stringify(res.headers));
          var json = JSON.stringify(res.headers);
          //console.log('res.headers.location: ' + res.headers.location);
          res.setEncoding('utf8');
          res.on('data', function (chunk) {
              //console.log('BODY: ' + chunk);
              body += chunk;
          }).on('end', () => {
            //console.log("body="+body);
            //console.log("res.headers.location="+res.headers.location);

            if(res.headers.location!=null){
              var ltiResponse = {
                ltiResponseURL: res.headers.location,
                ltiResponseHTML: ' ',
                ltiURL : params.ltiURL,
                ltiKey : params.ltiKey,
                ltiWidth: params.ltiWidth,
                ltiHeight : params.ltiHeight
              };
            }
            else {
              //callback(null, body);
              var ltiResponse = {
                ltiResponseURL: '',
                ltiResponseHTML: body,
                ltiURL : params.ltiURL,
                ltiKey : params.ltiKey,
                ltiWidth: params.ltiWidth,
                ltiHeight : params.ltiHeight
              };
            }
            callback(null, ltiResponse);

       }); //end on
   });

   console.log('Setting req error callback');
   req.on('error', function(err) {
     console.log('problem with request: ' + err.message);
       callback(err);
   });

   // write data to request body
   //req.write('query=' + encodeURIComponent(sparqlString));
   req.write(post_data);
   //req.write(encodeURIComponent(params));
   //req.write(JSON.stringify(params));
   //req.write(JSON.stringify(params));
   console.log('Written to request.');
   req.end();
   console.log('Request ended.');

        }//end if(resource=== 'lti')
    }

};
