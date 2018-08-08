import async from 'async';
import updateUsergroup from './updateUsergroup';
import { fetchUserDecks } from '../user/userprofile/fetchUserDecks';
import { fetchUser } from '../user/userprofile/fetchUser';
import notFoundError from '../error/notFoundError';
const log = require('../log/clog');
import loadUserCollections from '../collections/loadUserCollections';
import { shortTitle } from '../../configs/general';

export const categories = {
    categories: ['settings', 'decks', 'playlists']
};

export function chooseActionGroups(context, payload, done) {
    log.info(context);

    let title = shortTitle + ' | ';
    switch(payload.params.category){
        case categories.categories[0]:
        case undefined:
            title += 'Details of user group';
            break;
        case categories.categories[1]:
            title += 'Decks of user group';
            break;
        case categories.categories[2]:
            title += 'Playlists of user group';
            break;
        default:
            title = shortTitle;
    };
    context.dispatch('UPDATE_PAGE_TITLE', {pageTitle: title});

    console.log('choose action', payload.params.category, payload.params.id);
    

    async.series([
        (callback) => {
            context.executeAction(fetchUser, {}, callback);
        },
        (callback) => {
            switch (payload.params.category) {
                case categories.categories[0]:
                case undefined:
                    context.dispatch('USERGROUP_CATEGORY', payload.params.category);
                    context.executeAction(updateUsergroup, {group: {id: payload.params.id}}, callback);
                    break;
                case categories.categories[1]:
                    context.dispatch('USERGROUP_CATEGORY', payload.params.category);

                    let deckListType = payload.params.item === categories.decks[0] ? 'shared' : undefined;
                    context.executeAction(fetchUserDecks, {deckListType, params: {username: payload.params.username}}, callback);

                    break;
                case categories.categories[2]:
                    context.dispatch('USERGROUP_CATEGORY', payload.params.category);
                    context.executeAction(loadUserCollections, {}, callback);
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
