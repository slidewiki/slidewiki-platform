import log from '../log/clog';
import {navigateAction} from 'fluxible-router';
import notFoundError from '../error/notFoundError';
import methodNotAllowedError  from '../error/methodNotAllowedError';
import searchSyntaxError from '../error/searchSyntaxError';

export default function sendContactForm(context,payload,done){
    log.info(context);
    /* add the connection to the service
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

            log.info(context,res);
            context.dispatch('ATTACHSUBDECK_LOAD_SEARCHDECKS', res);
        }

    */
    //Normal action: inform user and navigateAction
    //log.info(context,res);
    swal({
        title: 'Contact Us',
        text: 'Feedback sent. Thank you!',
        type: 'success',
        confirmButtonText: 'Close',
        confirmButtonClass: 'positive ui button',
        allowEscapeKey: false,
        allowOutsideClick: false,
        buttonsStyling: false
    })
    .then(() => {
        //go to homepage
        this.context.executeAction(navigateAction, {//go to home page after password reset
            url: '/'
        });

    });
    done();
}
