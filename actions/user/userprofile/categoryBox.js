export default function changeTo(context, payload, done) {
    context.dispatch('CHANGE_TO', payload);
    done();
}
