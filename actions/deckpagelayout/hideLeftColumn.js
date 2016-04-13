export default function hideLeftColumn(context, payload, done) {
    context.dispatch('HIDE_LEFT_COLUMN', payload);
    done();
}
