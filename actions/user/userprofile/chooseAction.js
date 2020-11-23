import async from 'async';
import fetchUser from './fetchUser';
import fetchUserDecks from './fetchUserDecks';
import notFoundError from '../../error/notFoundError';
const log = require('../../log/clog');
import loadUserCollections from '../../collections/loadUserCollections';
import loadUserPerformancePredictions from '../../analytics/loadUserPerformancePredictions';
import loadUserRecommendations from '../../recommendations/loadUserRecommendations';
import { shortTitle, LTI_ID } from '../../../configs/general';
import UserProfileStore from '../../../stores/UserProfileStore';

import loadUserStats from '../../stats/loadUserStats';

export const categories = { //Do NOT alter the order of these items! Just add your items. Used in UserProfile and CategoryBox components
    categories: ['settings', 'groups', 'playlists', 'decks', 'recommendations', 'stats', 'ltis', 'analytics'],
    settings: ['profile', 'account', 'integrations'],
    groups: ['overview'],
    ltis: ['overview', 'edit'],
    decks: ['shared'],
    analytics: ['performanceprediction']
};

export function chooseAction(context, payload, done) {
    log.info(context);

    async.series([
        (callback) => {
            context.executeAction(fetchUser, payload, callback);
        },
        (callback) => {

            switch (payload.params.category) {
                case categories.categories[0]:
                case categories.categories[1]:
                    if(!categories.settings.includes(payload.params.item) && !categories.groups.includes(payload.params.item) ){
                        context.executeAction(notFoundError, {}, callback);
                        break;
                    }
                    context.dispatch('USER_CATEGORY', {category: payload.params.category, item: payload.params.item});
                    callback();
                    break;
                case categories.categories[2]:
                    context.dispatch('USER_CATEGORY', {category: payload.params.category, item: payload.params.item});
                    context.executeAction(loadUserCollections, {}, callback);
                    break;
                case undefined:
                case categories.categories[3]:
                    context.dispatch('USER_CATEGORY', {category: payload.params.category, item: payload.params.item});

                    let deckListType = payload.params.item === categories.decks[0] ? 'shared' : undefined;
                    context.executeAction(fetchUserDecks, {deckListType, params: {username: payload.params.username}}, callback);

                    break;
                case categories.categories[4]:
                    context.dispatch('USER_CATEGORY', {category: payload.params.category, item: payload.params.item});
                    context.executeAction(loadUserRecommendations, {}, callback);
                    break;
                case categories.categories[5]:
                    context.dispatch('USER_CATEGORY', {category: payload.params.category});
                    context.executeAction(loadUserStats, {}, callback);
                    break;
                case categories.categories[6]:
                    if(!categories.settings.includes(payload.params.item) && !categories.ltis.includes(payload.params.item) ){
                        context.executeAction(notFoundError, {}, callback);
                        break;
                    }
                    context.dispatch('USER_CATEGORY', {category: payload.params.category, item: payload.params.item});
                    callback();
                    break;
                case categories.categories[7]:
                    context.dispatch('USER_CATEGORY', {category: payload.params.category, item: payload.params.item});
                    context.executeAction(loadUserPerformancePredictions, {}, callback);
                    break;
                default:
                    context.executeAction(notFoundError, {}, callback);
            }

        }
    ],
    (err, result) => {
        if(err) console.log(err);
        done();
    });
}
