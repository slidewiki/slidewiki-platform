import async from 'async';
import { fetchUserDecks } from './fetchUserDecks';
import fetchUser from './fetchUser';

export default function fetchHomeUserDecks(context, payload, done) {
    async.series([
        (callback) => {
            context.executeAction(fetchUser, {params:{username: payload.username, id: payload.userid}}, callback);
        },
        (callback) => {
            context.executeAction(fetchUserDecks, {
                deckListType: undefined,
                params: {
                    username: payload.username,
                    sort: 'lastUpdate',
                    status: 'any',
                    roles: 'editor,owner'
                }
            }, callback);
        }
    ]);
    done();
}
