// import {shortTitle} from '../../configs/general';
//
// export default function loadAdvancedSearchResults(context, payload, done) {
//     context.service.read('searchresults.list', payload, {timeout: 20 * 1000}, (err, res) => {
//         if (err) {
//             context.dispatch('LOAD_ADVANCED_SEARCH_RESULTS_FAILURE', err);
//         } else {
//             context.dispatch('LOAD_ADVANCED_SEARCH_RESULTS_SUCCESS', res);
//         }
//
//         done();
//     });
// }
