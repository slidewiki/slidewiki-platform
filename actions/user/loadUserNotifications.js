import {shortTitle} from '../../configs/general';

export default function loadUserNotifications(context, payload, done) {
    // context.service.read('notifications.list', payload, {timeout: 20 * 1000}, (err, res) => {
    //     if (err) {
    //         context.dispatch('LOAD_USER_NOTIFICATIONS_FAILURE', err);
    //     } else {
    //         context.dispatch('LOAD_USER_NOTIFICATIONS_SUCCESS', res);
    //         // context.dispatch('UPDATE_ACTIVITY_TYPE_SUCCESS', {activityType: 'all'});
    //     }
    //     let pageTitle = shortTitle + ' | User notifications | ' + payload.params.uid;
    //     context.dispatch('UPDATE_PAGE_TITLE', {
    //         pageTitle: pageTitle
    //     });
    //     done();
    // });
    done();
}
