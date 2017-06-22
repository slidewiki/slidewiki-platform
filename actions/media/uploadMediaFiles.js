import UserProfileStore from '../../stores/UserProfileStore';
import {Microservices} from '../../configs/microservices';
const log = require('../log/clog');

export default function uploadMediaFiles(context, payload, done) {
    log.info(context);

    payload.userid = context.getStore(UserProfileStore).userid;
    payload.jwt = context.getStore(UserProfileStore).jwt;

    console.log(payload);
    context.dispatch('START_UPLOADING_MEDIA_FILE', {type: payload.type, name: payload.title});

    context.service.create('media.create', payload, { timeout: 20 * 1000 }, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            // Every file send to the file-service gets checked if its distinct, if so 409 is returned
            // All images of all users are regarded thus the 409 response is really common
            // if (error.length > 1) {
            //     error = JSON.parse(error);
            // }
            // if (error.statusCode === 409) {
            //     let parts = error.message.split(' ');
            //     let filename = parts[parts.length-1];
            //     payload.url = Microservices.file.uri + '/picture/' + filename;
            //     payload.thumbnailUrl = Microservices.file.uri + '/picture/' + res.thumbnailName;
            //     context.dispatch('SUCCESS_UPLOADING_MEDIA_FILE', payload);
            // }

            context.dispatch('FAILURE_UPLOADING_MEDIA_FILE', err);
        }
        else {
            payload.url = Microservices.file.uri + '/picture/' + res.filename;
            payload.thumbnailUrl = Microservices.file.uri + '/picture/' + res.thumbnailName;
            context.dispatch('SUCCESS_UPLOADING_MEDIA_FILE', payload);
        }
        done();
    });
}
