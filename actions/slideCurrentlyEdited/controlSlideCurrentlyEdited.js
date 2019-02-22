import log from '../log/clog';
import UserProfileStore from '../../stores/UserProfileStore';

export default function controlSlidesCurrentlyEdited(context, payload, done) {

    log.info(context);
    let user = context.getUser();

    let sid = payload.sid;

    let jwt = payload.jwt = context.getStore(UserProfileStore).jwt;

    context.service.read('slidesCurrentlyEdited.slide', payload, {timeout: 20 * 1000}, (err, res) => {
        if(err) {
            // console.log(err);
        }

        let timestamp = new Date().toString();

        let payload = {
            timestamp: timestamp,
            slideCurrentlyEdited: sid,
            jwt: jwt
        };

        context.service.create('slidesCurrentlyEdited.slide', payload, {timeout: 20 * 1000}, {}, (err2, res2) => {
            if (err2) {
                // console.log(err);
            }
            let slideCurrentlyEdited = JSON.parse(res2.slideCurrentlyEdited);
            let params = {
                eventId: slideCurrentlyEdited.id
            };
            context.dispatch('UPDATE_EVENT_ID', params);
            done();
        });

        let params = {
            slideCurrentlyEditedId: sid,
            usersCurrentlyEditing: []
        };

        let username = user.username ? user.username : null;

        // take only different users currently editing the slide.
        res.slidesCurrentlyEdited = res.slidesCurrentlyEdited.filter((elem) => elem.userId !== username);
        res.slidesCurrentlyEdited.forEach((elem) => {
            params.usersCurrentlyEditing.push({
                user: elem.userId,
                timestamp: elem.timestamp
            });
        });

        context.dispatch('GET_USERS_EDITING_SLIDE', params);

    });

    done();
}
