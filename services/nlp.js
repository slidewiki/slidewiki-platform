import { Microservices } from '../configs/microservices';
import rp from 'request-promise';

export default {
    name: 'nlp',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {

        if(resource === 'nlp.recommendedTags'){

            // TODO: request these params to be default in nlp-service
            let queryParams = 'performTitleBoost=true&titleBoostWithFixedFactor=-1&titleBoostlimitToFrequencyOfMostFrequentWord=true&minFrequencyOfTermOrEntityToBeConsidered=2&minCharLengthForTag=3&maxNumberOfWordsForNEsWhenNoLinkAvailable=4&maxEntriesToReturnTagRecommendation=20';
            let uri = `${Microservices.nlp.uri}/nlp/tagRecommendations/${params.selector.id}?${queryParams}`;
            rp.get({
                uri: uri,
                json: true,
            }).then((res) => {
                callback(null, {
                    selector: params.selector, 
                    recommendedTags: res
                });
            }).catch((err) => {
                callback(err);
            });
        }
    }
};
