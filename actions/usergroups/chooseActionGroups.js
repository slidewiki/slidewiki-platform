import async from 'async';
import UserProfileStore from '../../stores/UserProfileStore';
import updateUsergroup from './updateUsergroup';
import fetchGroupDecks from './fetchGroupDecks';
import fetchUser from '../user/userprofile/fetchUser';
import notFoundError from '../error/notFoundError';
const log = require('../log/clog');
import loadGroupCollections from '../collections/loadGroupCollections';
import loadGroupStats from '../stats/loadGroupStats';

import { shortTitle } from '../../configs/general';

export const categories = {
    categories: ['settings', 'decks', 'playlists', 'stats']
};

export default function chooseActionGroups(context, payload, done) {
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
        case categories.categories[3]:
            title += 'User Group Stats';
            break;
        default:
            title = shortTitle;
    };

    // console.log('choose action', payload.params.category, payload.params.id);


    async.series([
        (callback) => {
            context.executeAction(updateUsergroup, {group: {_id: payload.params.id}}, callback);
        },
        (callback) => {
            context.dispatch('USERGROUP_CATEGORY', payload.params.category);
            context.executeAction(fetchUser, {params: {username: context.getStore(UserProfileStore).username}}, callback);
        },
        (callback) => {
            context.dispatch('UPDATE_PAGE_TITLE', {pageTitle: title});
            callback();
        },
        (callback) => {
            switch (payload.params.category) {
                case categories.categories[0]:

                    callback();
                    break;
                case categories.categories[1]:
                case undefined:
                case 'undefined':

                    context.executeAction(fetchGroupDecks, {params: {groupid: payload.params.id}}, callback);

                    break;
                case categories.categories[2]:
                    context.executeAction(loadGroupCollections, {groupid: payload.params.id}, callback);
                    break;
                case categories.categories[3]:
                    context.executeAction(loadGroupStats, {groupid: payload.params.id}, callback);
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
