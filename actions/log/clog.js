exports.error = function(context, message='') {
    let logFields = {};
    logFields.Actions = context.stack.slice();
    if (context.getUser() !== 'undefined')
        logFields.User = context.getUser().username;

    if (message)
        logFields.message = message;

    context.service.update('log.error', '', logFields, (err, res) => {
        if (err)
            console.log(err);
    });
    return;
};

exports.warning = function(context, msg='') {
    let logFields = {};
    logFields.Actions = context.stack.slice();
    if (context.getUser() !== 'undefined')
        logFields.User = context.getUser().username;

    if (message)
        logFields.message = message;

    context.service.update('log.warning', '', logFields, (err, res) => {
        if (err)
            console.log(err);
    });
    return;
};

exports.info = function(context, message='') {
    let logFields = {};
    logFields.Actions = context.stack.slice();
    if (context.getUser() !== 'undefined')
        logFields.User = context.getUser().username;

    if (message)
        logFields.message = message;

    context.service.update('log.info', '', logFields, (err, res) => {
        if (err)
            console.log(err);
    });
    return;
};

exports.crit = function(context, msg='') {
    let logFields = {};
    logFields.Actions = context.stack.slice();
    if (context.getUser() !== 'undefined')
        logFields.User = context.getUser().username;

    if (message)
        logFields.message = message;

    context.service.update('log.crit', '', logFields, (err, res) => {
        if (err)
            console.log(err);
    });
    return;
};

exports.debug = function(context, msg='') {
    let logFields = {};
    logFields.Actions = context.stack.slice();
    if (context.getUser() !== 'undefined')
        logFields.User = context.getUser().username;

    if (message)
        logFields.message = message;

    context.service.update('log.debug', '', logFields, (err, res) => {
        if (err)
            console.log(err);
    });
    return;
};

exports.notice = function(context, msg='') {
    let logFields = {};
    logFields.Actions = context.stack.slice();
    if (context.getUser() !== 'undefined')
        logFields.User = context.getUser().username;

    if (message)
        logFields.message = message;

    context.service.update('log.notice', '', logFields, (err, res) => {
        if (err)
            console.log(err);
    });
    return;
};

exports.emerg = function(context, msg='') {
    let logFields = {};
    logFields.Actions = context.stack.slice();
    if (context.getUser() !== 'undefined')
        logFields.User = context.getUser().username;

    if (message)
        logFields.message = message;

    context.service.update('log.emerg', '', logFields, (err, res) => {
        if (err)
            console.log(err);
    });
    return;
};

exports.alert = function(context, msg='') {
    let logFields = {};
    logFields.Actions = context.stack.slice();
    if (context.getUser() !== 'undefined')
        logFields.User = context.getUser().username;

    if (message)
        logFields.message = message;

    context.service.update('log.alert', '', logFields, (err, res) => {
        if (err)
            console.log(err);
    });
    return;
};
