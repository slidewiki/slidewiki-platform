import notFoundError from '../error/notFoundError';
import methodNotAllowedError  from '../error/methodNotAllowedError';

export default function loadUserDecks(context,payload,done){
    context.service.read('userProfile.fetchUserDecks', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            if (err.statusCode === 404) {
                context.executeAction(notFoundError, {}, done);
                context.dispatch('ATTACHSUBDECK_LOAD_USERDECKS', []);
                return;
            } else if (err.statusCode === 401) {
                context.executeAction(methodNotAllowedError, {}, done);
                return;
            } else{
                context.dispatch('ATTACHSUBDECK_LOAD_USERDECKS', []);
            }
        } else { //Normal action
            context.dispatch('ATTACHSUBDECK_LOAD_USERDECKS', res);
        }
        done();
    });
}
