import {shortTitle} from '../../../configs/general';

/*export default function changeToMyDecks(context, payload, done) {
    context.dispatch('CHANGE_TO_MYDECKS', payload);
    done();
}*/

export default function changeToSettings(context, payload, done) {
    context.dispatch('CHANGE_TO_SETTINGS', payload);
    done();
}

/*export default function changeToMyStats(context, payload, done) {
    context.dispatch('CHANGE_TO_MYSTATS', payload);
    done();
}*/
