import {shortTitle} from '../../configs/general';

export default function updateUserResultsVisibility(context, payload, done) {
    context.dispatch('UPDATE_RESULTS_VISIBILITY', payload);
    done();
    // context.service.read('searchresults.list', payload, {timeout: 20 * 1000}, (err, res) => {
    //     if (err) {
    //         context.dispatch('UPDATE_RESULTS_VISIBILITY_FAILURE', err);
    //     } else {
    //         context.dispatch('UPDATE_RESULTS_VISIBILITY', res);
    //     }
    //
    //     done();
    // });
}







//
//
// export default function updateUserResultsVisibility(context, payload, done) {
//     context.dispatch('UPDATE_RESULTS_VISIBILITY', payload);
//     done();
// }
