import UserProfileStore from '../../stores/UserProfileStore';
import UserGroupsStore from '../../stores/UserGroupsStore';
import {Microservices} from '../../configs/microservices';
import saveUsergroup from './saveUsergroup';
const log = require('../log/clog');

export default function uploadPicture(context, payload, done) {
    log.info(context);

    payload.userid = context.getStore(UserProfileStore).userid;
    payload.jwt = context.getStore(UserProfileStore).jwt;

    let successCallback = (url) => {
        let group = context.getStore(UserGroupsStore).currentUsergroup;
        group.picture = url;

        context.executeAction(saveUsergroup, group, () => {

            done();
        });
    };

    context.service.create('media.create', payload, { timeout: 20 * 1000 }, { timeout: 20 * 1000 }, (err, res) => {
        delete payload.jwt;
        delete payload.userid;

        if (err) {
            // Every file send to the file-service gets checked if its distinct, if so 409 is returned
            // All images of all users are regarded thus the 409 response is really common
            if (err.statusCode === 409) {
                let parts = err.message.split(' ');
                let filename = parts[parts.length-1];
                // Check if the file is an SVG. (sub-path already included in filename for SVGs)
                let subpath = '/picture/';
                if (filename.includes('/graphic/')) subpath = '';
                filename = filename.substring(0, filename.length - 4);
                payload.url = Microservices.file.uri + subpath + filename;

                if (subpath === '') {
                    context.service.read('media.readCSV', {url: payload.url}, { timeout: 20 * 1000 }, (err, res) => {
                        successCallback(res);
                    });
                } else {
                    console.log('Got 409 from file service', payload);
                    successCallback(payload.url);
                }
            }
            else {
                context.dispatch('FAILURE_UPLOADING_MEDIA_FILE', err);
            }
        }
        else {
            let subPath = res.type === 'image/svg+xml' ? '/graphic/' : '/picture/';
            payload.url = Microservices.file.uri + subPath + res.fileName;
            if(res.type === 'image/svg+xml') {
                context.service.read('media.readCSV', {url: payload.url}, { timeout: 20 * 1000 }, (err, res) => {
                    successCallback(res);
                });
            } else {
                successCallback(payload.url);
            }
            /**/
        }
        done();
    });
}
