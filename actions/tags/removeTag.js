export default function removeTag(context, payload, done) {
    const {selector: { sid, id, stype }, tag} = payload;
    const serviceAddr = 'tags.' + stype;
    const objId = stype === 'slide'? sid: id;
    const params = {
        id: objId,
        tag: tag
    };

    context.service.create(serviceAddr, params, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('REMOVE_TAG_FAILURE', err);
        } else {
            context.dispatch('REMOVE_TAG', res);
            done();
        }
    });
}
