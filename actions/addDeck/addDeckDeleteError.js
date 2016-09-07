import {shortTitle} from '../../configs/general';
export default function addDeckDeleteError(context, payload, done) {
    context.dispatch('DELETE_ERROR', payload);
    done();
}
