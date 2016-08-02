import {shortTitle} from '../../configs/general';
export default function importFinished(context, payload, done) {
    context.dispatch('IMPORT_FINISHED', payload);
    done();
}
