import async from 'async';
import fetchUser from './fetchUser';
import { fetchUserDecks } from './fetchUserDecks';
import notFoundError from '../../error/notFoundError';
const log = require('../../log/clog');
import { shortTitle } from '../../../configs/general';
import UserProfileStore from '../../../stores/UserProfileStore';

export const categories = { //Do NOT alter the order of these items! Just add your items. Used in UserProfile and CategoryBox components
    categories: ['settings', 'groups'],
    settings: ['profile', 'account', 'integrations'],
    groups: ['overview', 'edit']
};

export function chooseAction(context, payload, done) {
    log.info(context);

    let title = shortTitle + ' | ';
    switch(payload.params.category){
        case categories.categories[0]:
            switch(payload.params.item){
                case categories.settings[0]:
                    title += 'Profile';
                    break;
                case categories.settings[1]:
                    title += 'Account';
                    break;
                case categories.settings[2]:
                    title += 'Authorized Accounts';
                    break;
                default:
                    title = shortTitle;
                    break;
            };
            break;
        case categories.categories[1]:
            switch(payload.params.item){
                case categories.groups[0]:
                    title += 'My Groups';
                    break;
                case categories.groups[1]:
                    title += 'Create Group';
                    break;
                default:
                    title = shortTitle;
                    break;
            };
            break;
        default:
            title = shortTitle;
    };
    context.dispatch('UPDATE_PAGE_TITLE', {pageTitle: title});

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
