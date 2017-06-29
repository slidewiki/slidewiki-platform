import log from '../log/clog';
import notFoundError from '../error/notFoundError';
import methodNotAllowedError  from '../error/methodNotAllowedError';

export default function loadSlides(context,payload,done){
    log.info(context);
    context.service.read('deck.slides', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {

            if (err.statusCode === 404) {
                context.executeAction(notFoundError, {}, done);
                context.dispatch('ATTACHSUBDECK_LOAD_SLIDES', []);
                return;
            } else if (err.statusCode === 401) {
                context.executeAction(methodNotAllowedError, {}, done);
                context.dispatch('ATTACHSUBDECK_LOAD_SLIDES', []);
                return;
            } else{
                log.error(context, {filepath: __filename});
                context.dispatch('ATTACHSUBDECK_LOAD_SLIDES', []);
            }
        } else { //Normal action

            context.dispatch('ATTACHSUBDECK_LOAD_SLIDES', res);
        }
        done();
    });

}
