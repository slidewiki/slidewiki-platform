export default function expandContributors(context, payload, done) {

    console.log('action expand');

    	context.dispatch('EXPAND_CONTRIBUTORS_SUCCESS', payload);
    	done();
}
