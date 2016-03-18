export default function expandActivityFeedPanel(context, payload, done) {
    context.dispatch('EXPAND_ACTIVITY_FEED_PANEL', payload);
    done();
}
