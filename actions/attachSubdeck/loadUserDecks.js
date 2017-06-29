import notFoundError from '../error/notFoundError';
import methodNotAllowedError  from '../error/methodNotAllowedError';
import log from '../log/clog';


export default function loadUserDecks(context,payload,done){
    log.info(context);
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
                log.error(context, {filepath: __filename});
                context.dispatch('ATTACHSUBDECK_LOAD_USERDECKS', []);
            }
        } else { //Normal action
            context.dispatch('ATTACHSUBDECK_LOAD_USERDECKS', res);
        }
        done();
    });
}
