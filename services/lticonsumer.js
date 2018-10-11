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
        let ltiURL = params.ltiURL;
        let ltiKey = params.ltiKey;
        let ltiHeight = params.ltiHeight;
        let ltiWidth = params.ltiWidth;

        // LTI paramters
        let args = params.params? params.params : params;

        let url = require('url');
        let http = require('http');
        let https = require('https');
        let request = require('request');
        let querystring = require('querystring');
        let btoa = require('btoa');
        let oauth = require('oauth-sign');
        let fs = require('fs');

        let parseURL = url.parse(ltiURL, true);
        let hostname = parseURL.hostname;
        let port = parseURL.port;
        let pathname = parseURL.pathname;

        //console.log('hostname='+hostname);
        //console.log('path='+pathname);
        //console.log('port='+port);

        if(resource === 'lticonsumer'){
            /*********connect to LTI Provider*************/
            let post_data = querystring.stringify(args);
            //console.log('lticonsumer.js.args='+JSON.stringify(args));
            let request_options = {
                hostname:  hostname,
                path: pathname,
                port: port,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };

            let body = '';
            let req = http.request(request_options, (res) => {
                console.log('STATUS: ' + res.statusCode);
                console.log('HEADERS: ' + JSON.stringify(res.headers));
                let json = JSON.stringify(res.headers);
                //console.log('res.headers.location: ' + res.headers.location);
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    //console.log('BODY: ' + chunk);
                    body += chunk;
                }).on('end', () => {
                //console.log("body="+body);
                //console.log("res.headers.location="+res.headers.location);
                    let ltiResponse;
                    if(res.headers.location!=null){
                        ltiResponse = {
                            ltiResponseURL: res.headers.location,
                            ltiResponseHTML: ' ',
                            ltiURL : params.ltiURL,
                            ltiKey : params.ltiKey,
                            ltiWidth: params.ltiWidth,
                            ltiHeight : params.ltiHeight
                        };
                    }
                    else {
                        ltiResponse = {
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
            req.on('error', (err) => {
                console.log('problem with request: ' + err.message);
                callback(err);
            });

            // write data to request body
            req.write(post_data);
            console.log('Written to request.');
            req.end();
            console.log('Request ended.');
        }//end if(resource=== 'lti')
    }
};
