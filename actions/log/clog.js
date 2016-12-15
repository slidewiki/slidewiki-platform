exports.error = function(context, payload, msg='') {
    //console.log('Hey error', context, payload, msg);
    payload.navStack = context.stack.slice();
    console.log('before setting:', msg);
    payload.msg = msg;
    console.log('after setting:', msg);
    context.service.update('log.error', payload, {timeout: 20 * 1000}, (err, res) => {
        //console.log(err);
    });
    return;
};

exports.info = function(context, payload, msg='') {
    payload.navStack = context.stack.slice();
    payload.msg = msg;
    context.service.update('log.info', payload, {timeout: 20 * 1000}, (err, res) => {
        //console.log(err);
    });
    return;
};
