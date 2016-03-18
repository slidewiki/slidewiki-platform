export default function expandContentPanel(context, payload, done) {
    context.dispatch('EXPAND_CONTENET_PANEL', payload);
    done();
}
