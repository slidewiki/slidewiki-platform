export default function newLTIData(context, payload, done) {
    context.dispatch('NEW_LTI_DATA', payload);
    done();
}
