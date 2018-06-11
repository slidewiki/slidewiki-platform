const log = require('../../log/clog');

export default function newSocialData(context, payload, done) {
    log.info(context);
    context.dispatch('NEW_SOCIAL_DATA', payload);
    done();
}
