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
