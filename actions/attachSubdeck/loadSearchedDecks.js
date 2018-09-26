import log from '../log/clog';
import notFoundError from '../error/notFoundError';
import methodNotAllowedError  from '../error/methodNotAllowedError';
import searchSyntaxError from '../error/searchSyntaxError';
import updateModalSubtitle from '../collections/updateModalSubtitle';

export default function loadSearchedDecks(context,payload,done){
    log.info(context);

    context.dispatch('ATTACHSUBDECK_LOAD_SEARCHDECKS_LOADING');
    context.executeAction(updateModalSubtitle, 'Search Results');
    
    context.service.read('searchresults.list', payload, {timeout: 20 * 1000}, (err, res) => {
        
        if (err) {
            if (err.statusCode === 404) {
                context.executeAction(notFoundError, {}, done);
                context.dispatch('ATTACHSUBDECK_LOAD_SEARCHDECKS', {docs:[]});
                return;
            } else if (err.statusCode === 401) {
                context.executeAction(methodNotAllowedError, {}, done);
                context.dispatch('ATTACHSUBDECK_LOAD_SEARCHDECKS', {docs:[]});
                return;
            } else if(err.statusCode === 400){ //bad request
                context.executeAction(searchSyntaxError, {}, done);
                context.dispatch('ATTACHSUBDECK_LOAD_SEARCHDECKS', {docs:[]});
                return;
            }
            else{
                log.error(context, {filepath: __filename});
                res={docs:[]};
                context.dispatch('ATTACHSUBDECK_LOAD_SEARCHDECKS', res);
                return;
            }
        } else { //Normal action
            res.queryparams = payload.params.queryparams || undefined;
            context.dispatch('ATTACHSUBDECK_LOAD_SEARCHDECKS', res);
        }

        done();
    });

}
