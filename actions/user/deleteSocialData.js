import fetchUser from './userprofile/fetchUser.js';
import async from 'async';

export default function deleteSocialData(context, payload, done) {
    context.dispatch('DELETE_SOCIAL_DATA', null);
    done();
}
