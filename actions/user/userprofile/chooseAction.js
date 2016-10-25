import async from 'async';
import fetchUser from './fetchUser';
import { fetchUserDecks } from './fetchUserDecks';
import notFoundError from '../../error/notFoundError';

export default function chooseAction(context, payload, done) {
    async.series([
        (callback) => {
            context.executeAction(fetchUser, payload, callback);
        },
        (callback) => {
            switch (payload.params.category) {
                case 'settings':
                    context.dispatch('USER_CATEGORY', {category: payload.params.category, item: payload.params.item});
                    callback();
                    break;
                case 'groups':
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
