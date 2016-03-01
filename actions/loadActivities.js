import {shortTitle} from '../configs/general';

export default function loadActivities(context, payload, done) {
    context.service.read('activities.list', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('LOAD_ACTIVITIES_FAILURE', err);
        } else {
            context.dispatch('LOAD_ACTIVITIES_SUCCESS', res);
            context.dispatch('UPDATE_ACTIVITY_TYPE_SUCCESS', {activityType: 'all'});
        }
        let pageTitle = shortTitle + ' | Activities | ' + payload.params.stype + ' | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
