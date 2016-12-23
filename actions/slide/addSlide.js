import {shortTitle} from '../../configs/general';
import serviceUnavailable from '../error/serviceUnavailable';
const clog = require('../log/clog');

export default function addSlide(context, payload, done) {
    //console.log(payload);

    context.service.create('slide.content', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            clog.error(context, payload, {filepath: __filename, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('ADD_SLIDE_EDIT_FAILURE', err); // not implemented in store
        } else {
            context.dispatch('ADD_SLIDE_EDIT_SUCCESS', res);
        }
        //let pageTitle = shortTitle + ' | Slide Edit | ' + payload.params.sid;
        let pageTitle = shortTitle + ' | Slide Edit | ';
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    }

  );
}
