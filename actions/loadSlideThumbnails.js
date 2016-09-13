import {shortTitle} from '../configs/general';
import { slideIdTypeError, serviceUnavailable } from './loadErrors';
import loadSlideView from './slide/loadSlideView';
let webshot = require('webshot');

export default function loadSlideThumbnails(context, payload, done) {
    if (!(/^[0-9a-zA-Z-]+$/.test(payload.params.sid) || payload.params.sid === undefined)) {
        context.executeAction(slideIdTypeError, payload).catch((err) => {done(err);});
        return;
    }
    context.service.read('slidethumbnail.content', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.executeAction(serviceUnavailable, payload).catch((error) => {done(error);});
            return;
        } else {
            console.log('Hi', res);
            webshot('<html><head></head<body><h1>Vinay</h1></body></html>', 'slideThumbnail.png', {siteType:'html'}, (err) => {
                console.log(err);
            // screenshot now saved to hello_world.png
            });
            //context.dispatch('LOAD_SLIDE_THUMBNAIL_CONTENT', res);
        }
        done();
    });
    //context.dispatch('LOAD_THUMBNAIL_TEST', res);
}
