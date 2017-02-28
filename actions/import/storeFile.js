import { shortTitle } from '../../configs/general';

export default function storeFile(context, payload, done) {
    context.dispatch('STORE_FILE', payload);
    done();
}
