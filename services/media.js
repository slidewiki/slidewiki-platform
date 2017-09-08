import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
import { isEmpty } from '../common.js';
const log = require('../configs/log').log;
import formdata from 'form-data';

export default {
    name: 'media',
    create: (req, resource, params, config, emptyObject, callback) => {
        if (resource === 'media.create') {
            // It was hard to send a files data to the service.
            // giving the file as parameter to here is not possible because it gets parsed before send via https
            // FileReader does not create Array buffers (is just undefined)
            // Not all outputs of FileReader are accepted by the API
            // form-data could not be used because the API does not expect multiform

            let url = Microservices.file.uri + '/picture?' + 'license='+encodeURIComponent(params.license)+'&copyright='+encodeURIComponent(params.license+' by user '+params.userid)+'&title='+encodeURIComponent(params.title);//+'&altText='+encodeURIComponent(params.text);
            // console.log('use url', url);
            let headers = {
                '----jwt----': params.jwt,
                'content-type': params.type
            };
            rp.post({
                uri: url,
                body: new Buffer(params.bytes.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64'),
                headers: headers,
                json: false
            })
                .then((res) => {
                    // console.log('response from saving image:', res);
                    callback(null, JSON.parse(res));
                })
                .catch((err) => {
                    console.log('Error while saving image', (err.response) ? {body: err.response.body, headers: err.response.request.headers} : err);
                    callback(err, null);
                });
        }
        else if (resource === 'media.uploadProfilePicture') {
            let url = Microservices.file.uri + '/profilepicture/' + params.username;
            let headers = {
                '----jwt----': params.jwt,
                'content-type': params.type
            };
            rp.put({
                uri: url,
                body: new Buffer(params.bytes.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64'),
                headers: headers,
                json: false
            })
                .then((res) => {
                    // console.log('response from saving image:', res);
                    callback(null, Microservices.file.uri + res);
                })
                .catch((err) => {
                    console.log('Error while saving image', (err.response) ? {body: err.response.body, headers: err.response.request.headers} : err);
                    callback(err, null);
                });
        }
    }
};
