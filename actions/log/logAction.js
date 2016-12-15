

export default function loadCustomlog(context, payload, done) {
    context.service.update('log.error', {reqId: payload.navigate.reqId, navStack: context.stack}, (err, res) => {
        done();
    });
}
