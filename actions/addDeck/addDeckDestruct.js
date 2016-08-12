import {shortTitle} from '../../configs/general';
export default function addDeckDestruct(context, payload, done) {
    context.dispatch('DESTRUCT', payload);
    done();
}
