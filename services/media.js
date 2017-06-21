import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
import { isEmpty } from '../common.js';
const log = require('../configs/log').log;
import formdata from 'form-data';

export default {
    name: 'media',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {

    },

    create: (req, resource, params, config, callback) => {
        if (resource === 'media.create') {
            // let form = new formdata();
            //
            // //create a HTTP POST form request
            // form.append('file', params.base64);
            // form.append('filename', params.filename ? params.filename : 'unknown');
            // form.append('user', params.userid);
            // form.append('jwt', params.jwt);
            // form.append('language', params.language);
            // form.append('title', params.title);
            // form.append('description', params.text);
            // form.append('license', params.license);
            // form.append('contentType', params.type);
            //
            //     // form.submit(Microservices.import.url + '/importPPTX'
            // let request = form.submit({
            //     port: Microservices.file.port ? Microservices.import.port : 3000,
            //     host: Microservices.import.host,
            //     path: Microservices.import.path ? Microservices.import.path : '/',
            //     protocol: Microservices.import.protocol ? Microservices.import.protocol : 'https:',
            //     timeout: body.timeout
            // }, (err, res) => {
            //     //res.setTimeout(body.timeout);
            //
            //     if (err) {
            //         console.error(err);
            //         //only callback if no timeout
            //         if (err.toString() !== 'Error: XMLHttpRequest timeout')
            //             callback(err, null);
            //         return;
            //     }
            //
            //     // console.log('result of call to import-microservice', res.headers, res.statusCode);
            //     //res does not contain any data ...
            //     //the response data have to be send via headers
            //     callback(null, res);//TODO get url
            // });

            let url = Microservices.file.uri + '/picture'+'?license='+params.license+'&copyright='+params.license+' by user '+params.userid+'&title='+params.title+'&altText='+params.text;
            console.log('use url', url);
            rp.post({
                uri: url,
                formData: {
                    file: params.bytes,
                    filename: params.filename ? params.filename : 'unknown'
                },
                resolveWithFullResponse: true,
                headers: {
                    '----jwt----': params.jwt,
                    'content-type': params.type
                }
            })
                .then((res) => {
                    console.log('response from saving image:', res);
                    callback(null, 'dummy');
                })
                .catch((err) => {
                    console.log('Error while saving image', err.response);
                    callback(err, null);
                });
        }
    }
};
