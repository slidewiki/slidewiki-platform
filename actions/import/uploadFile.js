import { shortTitle } from '../../configs/general';

export default function uploadFile(context, payload, done) {
    context.service.create('import', payload, {}, (err, res) => {
        if (err) {
            context.dispatch('UPLOAD_FAILED', err);
        } else {
            context.dispatch('UPLOAD_SUCCESS', res);
        }
        done();
    });
}
