import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
import { isEmpty } from '../common.js';
const log = require('../configs/log').log;
import formdata from 'form-data';

export default {
    name: 'media',
    create: (req, resource, params, config, callback) => {
        if (resource === 'media.create') {
            // I am not able to send a files data to the service.
            // giving the file as parameter to here is not possible because it gets parsed before send via https
            // FileReader does not create Array buffers (is just undefined)
            // All other outputs of FileReader are not accepted by the API
            // form-data could not be used because the API does not expect multiform
            
            let url = Microservices.file.uri + '/picture?' + 'license='+encodeURIComponent(params.license)+'&copyright='+encodeURIComponent(params.license+' by user '+params.userid)+'&title='+encodeURIComponent(params.title)+'&altText='+encodeURIComponent(params.text);
            console.log('use url', url);
            let headers = {
                '----jwt----': params.jwt,
                'content-type': params.type,
                'Accept':  'application/json'
            };
            console.log('use headers', headers);
            let bytes = '';
            try {
                bytes = Buffer.from(params.bytes, 'base64');
            } catch (e) {
                console.log(e);
            }
            rp.post({
                uri: url,
                body: params.file,
                resolveWithFullResponse: true,
                headers: headers
            })
                .then((res) => {
                    console.log('response from saving image:', res.response.body, );
                    callback(null, 'dummy');
                })
                .catch((err) => {
                    console.log('Error while saving image', err.response.body, err.response.request);
                    callback(err, null);
                });
        }
    }
};
