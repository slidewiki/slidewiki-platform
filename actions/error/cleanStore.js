import ErrorStore from '../../stores/ErrorStore';

export default function cleanStore(context, payload, done) {
    context.dispatch('CLEAN_ERROR_STORE');
    done();
}
