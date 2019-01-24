import {Microservices} from '../configs/microservices';
import formdata from 'form-data';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'import',
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;
        rp.get({uri: Microservices.file.uri + '/thumbnail/slide/' + args.slide.id + '/' + (args.theme ? args.theme : 'default'), encoding: null, timeout: 2000}).then((res) => {
            callback(null, new Buffer(res).toString('base64'));
        }).catch((err) => {
            callback(err, '');
        });        
    },
    create: (req, resource, params, body, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'create', Method: req.method});
        let form = new formdata();

        //create a HTTP POST form request
        form.append('file', params.base64);
        form.append('filename', params.filename ? params.filename : 'unknown');
        form.append('language', params.language);
        form.append('title', params.title);
        form.append('description', params.description);
        form.append('theme', params.theme);
        form.append('license', params.license);
        form.append('tags', JSON.stringify(params.tags));

        form.append('contentType', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
            //knownLength: params.file.size ? params.file.size : params.base64.length

            // form.submit(Microservices.import.url + '/importPPTX'
        let request = form.submit({
            port: Microservices.import.port ? Microservices.import.port : 3000,
            host: Microservices.import.host,
            path: Microservices.import.path ? Microservices.import.path : '/',
            protocol: Microservices.import.protocol ? Microservices.import.protocol : 'https:',
            timeout: body.timeout,
            headers: { '----jwt----': params.jwt },
        }, (err, res) => {
            //res.setTimeout(body.timeout);

            if (err) {
                console.error(err);
                //only callback if no timeout
                if (err.toString() !== 'Error: XMLHttpRequest timeout')
                    callback(err, null);
                return;
            }

            // console.log('result of call to import-microservice', res.headers, res.statusCode);
            //res does not contain any data ...
            //the response data have to be send via headers
            callback(null, res.headers);
        });
    }
};
