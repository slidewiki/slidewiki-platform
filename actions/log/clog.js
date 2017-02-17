exports.error = function(context, payload, msg='') {
    const body = (typeof context === 'object' && context.hasOwnProperty('stack')) ? {actions: context.stack.slice(), msg: msg} : {actions: [], msg: msg};
    context.service.update('log.error', payload, body, (err, res) => {
        if (err)
            console.log(err);
    });
    return;
};

exports.warning = function(context, payload, msg='') {
    const body = (typeof context === 'object' && context.hasOwnProperty('stack')) ? {actions: context.stack.slice(), msg: msg} : {actions: [], msg: msg};
    context.service.update('log.warn', payload, body, (err, res) => {
        if (err)
            console.log(err);
    });
    return;
};

exports.info = function(context, payload, msg='') {
    const body = (typeof context === 'object' && context.hasOwnProperty('stack')) ? {actions: context.stack.slice(), msg: msg} : {actions: [], msg: msg};
    context.service.update('log.info', payload, body, (err, res) => {
        if (err)
            console.log(err);
    });
    return;
};

exports.crit = function(context, payload, msg='') {
    const body = (typeof context === 'object' && context.hasOwnProperty('stack')) ? {actions: context.stack.slice(), msg: msg} : {actions: [], msg: msg};
    context.service.update('log.crit', payload, body, (err, res) => {
        if (err)
            console.log(err);
    });
    return;
};

exports.debug = function(context, payload, msg='') {
    const body = (typeof context === 'object' && context.hasOwnProperty('stack')) ? {actions: context.stack.slice(), msg: msg} : {actions: [], msg: msg};
    context.service.update('log.debug', payload, body, (err, res) => {
        if (err)
            console.log(err);
    });
    return;
};

exports.notice = function(context, payload, msg='') {
    const body = (typeof context === 'object' && context.hasOwnProperty('stack')) ? {actions: context.stack.slice(), msg: msg} : {actions: [], msg: msg};
    context.service.update('log.notice', payload, body, (err, res) => {
        if (err)
            console.log(err);
    });
    return;
};

exports.emerg = function(context, payload, msg='') {
    const body = (typeof context === 'object' && context.hasOwnProperty('stack')) ? {actions: context.stack.slice(), msg: msg} : {actions: [], msg: msg};
    context.service.update('log.emerg', payload, body, (err, res) => {
        if (err)
            console.log(err);
    });
    return;
};

exports.alert = function(context, payload, msg='') {
    const body = (typeof context === 'object' && context.hasOwnProperty('stack')) ? {actions: context.stack.slice(), msg: msg} : {actions: [], msg: msg};
    context.service.update('log.alert', payload, body, (err, res) => {
        if (err)
            console.log(err);
    });
    return;
};
