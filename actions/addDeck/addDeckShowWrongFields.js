import {shortTitle} from '../../configs/general';
export default function addDeckShowWrongFields(context, payload, done) {
    context.dispatch('SHOW_WRONG_FIELDS', payload);
    done();
}
