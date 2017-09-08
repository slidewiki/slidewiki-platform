import UserProfileStore from '../../stores/UserProfileStore';
import {Microservices} from '../../configs/microservices';
const log = require('../log/clog');

export default function uploadProfilePicture(context, payload, done) {
    log.info(context);

    payload.userid = context.getStore(UserProfileStore).userid;
    payload.jwt = context.getStore(UserProfileStore).jwt;
    payload.username = context.getStore(UserProfileStore).username;

    console.log('uploadProfilePicture', payload);
    context.dispatch('START_UPLOADING_MEDIA_FILE', {type: payload.type, name: 'profile picture'});

    context.service.create('media.uploadProfilePicture', payload, { timeout: 20 * 1000 }, { timeout: 20 * 1000 }, (err, res) => {
        delete payload.jwt;
        delete payload.userid;
        delete payload.username;

        if (err) {
            context.dispatch('FAILURE_UPLOADING_MEDIA_FILE', err);
        }
        else {
            payload.url = res;
            context.dispatch('SUCCESS_UPLOADING_MEDIA_FILE', payload);
        }
        done();
    });
}
