import log from '../log/clog';

export default function controlSlideEditions(context, slideId, done) {

    log.info(context);
    let user = context.getUser();

    let username = user.username ? user.username : null;

    context.service.read('currentSlidesEditions.slide', slideId, {timeout: 20 * 1000}, (err, res) => {

    });

    done();
}
