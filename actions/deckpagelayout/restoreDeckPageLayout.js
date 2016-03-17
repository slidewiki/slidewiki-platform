export default function restoreDeckPageLayout(context, payload, done) {
    context.dispatch('RESTORE_DECK_PAGE_LAYOUT', payload);
    done();
}
