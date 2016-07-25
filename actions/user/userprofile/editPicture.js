import { shortTitle } from '../../../configs/general';

export default function changeTo(context, payload, done) {
    context.service.update('userProfile.removePicture', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('REMOVE_PICTURE_FAILED', err);
        } else {
            context.dispatch('REMOVE_PICTURE', res);
        }
    });
    done();
}
