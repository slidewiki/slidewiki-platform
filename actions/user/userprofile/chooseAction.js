import async from 'async';
import fetchUser from './fetchUser';
import { fetchUserDecks } from './fetchUserDecks';
import notFoundError from '../../error/notFoundError';
const log = require('../../log/clog');
import loadUserCollections from '../../collections/loadUserCollections';
import loadUserRecommendations from '../../recommendations/loadUserRecommendations';
import { shortTitle } from '../../../configs/general';
import UserProfileStore from '../../../stores/UserProfileStore';

export const categories = { //Do NOT alter the order of these items! Just add your items. Used in UserProfile and CategoryBox components
    //categories: ['settings', 'groups', 'playlists', 'decks', 'recommendations'],
    categories: ['settings', 'groups', 'playlists', 'decks', 'recommendations', 'ltis'],
    settings: ['profile', 'account', 'integrations'],
    groups: ['overview', 'edit'],
    ltis: ['overview', 'edit'],
    decks: ['shared'],
};

export function chooseAction(context, payload, done) {
    log.info(context);
    console.log('chooseAction.context='+JSON.stringify(context));
    console.log('chooseAction.payload='+JSON.stringify(payload));
    console.log('chooseAction.payload.params.username='+payload.params.username);
    console.log('chooseAction.payload.params.username='+payload.params.username.endsWith('@lti.org'));
    //console.log('chooseAction.payload.params.username='+this.props.UserProfileStore.user.email);
    let title = shortTitle + ' | ';
    if(!(payload.params.username.endsWith('@lti.org')))
    {
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
        case categories.categories[2]:
            title += 'Playlists';
            break;
        case undefined:
        case categories.categories[3]:
            switch(payload.params.item){
                case categories.decks[0]:
                    title += 'Shared Decks';
                    break;
                default:
                    title += 'My Decks';
                    break;
            };
            break;
        case categories.categories[5]:
            switch(payload.params.item){
                case categories.ltis[0]:
                    title += 'My LTIs';
                    break;
                case categories.ltis[1]:
                    title += 'Create LTI';
                    break;
                default:
                    title = shortTitle;
                    break;
            };
            break;

        default:
            title = shortTitle;
    };

  }
  else{


  }//end else
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
                    if(!categories.settings.includes(payload.params.item) && !categories.ltis.includes(payload.params.item) ){
                            context.executeAction(notFoundError, {}, callback);
                            break;
                        }
                        context.dispatch('USER_CATEGORY', {category: payload.params.category, item: payload.params.item});
                        callback();
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
