import async from 'async';
import fetchUser from './fetchUser';
import { fetchUserDecks } from './fetchUserDecks';
import notFoundError from '../../error/notFoundError';

export const categories = { //Do NOT alter the order of these items! Just add your items. Used in UserProfile and CategoryBox components
    categories: ['settings', 'groups'],
    settings: ['profile', 'account', 'integrations'],
    groups: ['overview']
};

export function chooseAction(context, payload, done) {
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
                case undefined:
                    context.executeAction(fetchUserDecks, {params: {username: payload.params.username}}, callback);
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
