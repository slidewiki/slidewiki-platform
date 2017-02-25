export default function addReply(context, payload, done) {
    console.log(payload);
    const {selector: { sid, id, stype }, tag} = payload;
    const serviceAddr = 'tags.' + stype;
    const objId = stype === 'slide'? sid: id;
    const params = {
        id: objId,
        tag: tag
    };

    context.service.create(serviceAddr, params, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('ADD_TAG_FAILURE', err);
        } else {
            context.dispatch('NEW_TAG', res);
            done();
        }
    });
}
