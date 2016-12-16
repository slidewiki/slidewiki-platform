exports.error = function(context, payload, msg='') {
    const body = {navStack: context.stack.slice(), msg: msg};
    context.service.update('log.error', payload, body, (err, res) => {
        if (err)
            console.log(err);
    });
    return;
};

exports.warn = function(context, payload, msg='') {
    const body = {navStack: context.stack.slice(), msg: msg};
    context.service.update('log.warn', payload, body, (err, res) => {
        if (err)
            console.log(err);
    });
    return;
};

exports.info = function(context, payload, msg='') {
    const body = {navStack: context.stack.slice(), msg: msg};
    context.service.update('log.info', payload, body, (err, res) => {
        if (err)
            console.log(err);
    });
    return;
};

exports.verbose = function(context, payload, msg='') {
    const body = {navStack: context.stack.slice(), msg: msg};
    context.service.update('log.verbose', payload, body, (err, res) => {
        if (err)
            console.log(err);
    });
    return;
};

exports.debug = function(context, payload, msg='') {
    const body = {navStack: context.stack.slice(), msg: msg};
    context.service.update('log.debug', payload, body, (err, res) => {
        if (err)
            console.log(err);
    });
    return;
};

exports.silly = function(context, payload, msg='') {
    const body = {navStack: context.stack.slice(), msg: msg};
    context.service.update('log.silly', payload, body, (err, res) => {
        if (err)
            console.log(err);
    });
    return;
};
