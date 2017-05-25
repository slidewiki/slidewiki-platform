import log from '../log/clog';
import notFoundError from '../error/notFoundError';
import methodNotAllowedError  from '../error/methodNotAllowedError';

export default function loadSearchedDecks(context,payload,done){
    log.info(context);
    context.service.read('searchresults.list', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            if (err.statusCode === 404) {
                context.executeAction(notFoundError, {}, done);
                context.dispatch('ATTACHSUBDECK_LOAD_SEARCHDECKS', []);
                return;
            } else if (err.statusCode === 401) {
                context.executeAction(methodNotAllowedError, {}, done);
                context.dispatch('ATTACHSUBDECK_LOAD_SEARCHDECKS', []);
                return;
            } else{
                log.error(context, {filepath: __filename, err: err});
                context.dispatch('ATTACHSUBDECK_LOAD_SEARCHDECKS', []);
                return;
            }
        } else { //Normal action

            log.info(context,res);
            context.dispatch('ATTACHSUBDECK_LOAD_SEARCHDECKS', res);
        }

        done();
    });

}
