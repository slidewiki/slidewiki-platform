import log from '../log/clog';
import UserProfileStore from '../../stores/UserProfileStore';

export default function controlSlidesCurrentlyEdited(context, payload, done) {

    log.info(context);
    let user = context.getUser();

    let sid = payload.sid;

    context.service.read('slidesCurrentlyEdited.slide', payload, {timeout: 20 * 1000}, (err, res) => {
        if(err) {
            // console.log(err);
        }

        let username = user.username ? user.username : null;
        let timestamp = new Date().toString();

        let payload = {
            userId: username,
            timestamp: timestamp,
            slideCurrentlyEdited: sid
        };

        context.service.create('slidesCurrentlyEdited.slide', payload, {timeout: 20 * 1000}, {}, (err2, res2) => {
            if (err2) {
                //
            }
            done();
        });
    });

    done();
}
