const log = require('../log/clog');

export default function loadRecommendedTags(context, payload, done) {
    log.info(context);

    context.dispatch('RESET_TAG_RECOMMENDATIONS');
    context.dispatch('SET_TAG_RECOMMENDATIONS_LOADING', true);

    context.service.read('nlp.recommendedTags', payload, {timeout: 20 * 1000}, (err, res) => {
    	if(err){
    		log.error(context, {filepath: __filename, err: err});
    		context.dispatch('LOAD_TAG_RECOMMENDATIONS_FAILURE', res);
    	} else {
    		context.dispatch('LOAD_TAG_RECOMMENDATIONS_SUCCESS', res);
    	}

        context.dispatch('SET_TAG_RECOMMENDATIONS_LOADING', false);
        done();
    });
}
