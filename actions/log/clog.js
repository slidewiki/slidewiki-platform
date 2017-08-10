exports.error = function(context, message='') {
    if (!isAllowedLogLevel('error'))
        return;

    let logFields = {};
    logFields.Actions = context.stack.slice();
    if (context.getUser() !== undefined)
        logFields.User = context.getUser().username;

    if (message)
        logFields.message = message;

    context.service.update('log.error', '', logFields, (err, res) => {
        //if (err)
        //    console.log(err);
    });
    return;
};

exports.warning = function(context, message='') {
    if (!isAllowedLogLevel('warning'))
        return;

    let logFields = {};
    logFields.Actions = context.stack.slice();
    if (context.getUser() !== undefined)
        logFields.User = context.getUser().username;

    if (message)
        logFields.message = message;

    context.service.update('log.warning', '', logFields, (err, res) => {
        //if (err)
        //    console.log(err);
    });
    return;
};

exports.info = function(context, message='') {
    if (!isAllowedLogLevel('info'))
        return;

    let logFields = {};
    logFields.Actions = context.stack.slice();
    if (context.getUser() !== undefined)
        logFields.User = context.getUser().username;

    if (message)
        logFields.message = message;

    context.service.update('log.info', '', logFields, (err, res) => {
        //if (err)
        //console.log(err);
    });
    return;
};

exports.crit = function(context, message='') {
    if (!isAllowedLogLevel('crit'))
        return;

    let logFields = {};
    logFields.Actions = context.stack.slice();
    if (context.getUser() !== undefined)
        logFields.User = context.getUser().username;

    if (message)
        logFields.message = message;

    context.service.update('log.crit', '', logFields, (err, res) => {
        //if (err)
        //    console.log(err);
    });
    return;
};

exports.debug = function(context, message='') {
    if (!isAllowedLogLevel('debug'))
        return;

    let logFields = {};
    logFields.Actions = context.stack.slice();
    if (context.getUser() !== undefined)
        logFields.User = context.getUser().username;

    if (message)
        logFields.message = message;

    context.service.update('log.debug', '', logFields, (err, res) => {
        //if (err)
        //    console.log(err);
    });
    return;
};

exports.notice = function(context, message='') {
    if (!isAllowedLogLevel('notice'))
        return;

    let logFields = {};
    logFields.Actions = context.stack.slice();
    if (context.getUser() !== undefined)
        logFields.User = context.getUser().username;

    if (message)
        logFields.message = message;

    context.service.update('log.notice', '', logFields, (err, res) => {
        //if (err)
        //    console.log(err);
    });
    return;
};

exports.emerg = function(context, message='') {
    if (!isAllowedLogLevel('emerg'))
        return;

    let logFields = {};
    logFields.Actions = context.stack.slice();
    if (context.getUser() !== undefined)
        logFields.User = context.getUser().username;

    if (message)
        logFields.message = message;

    context.service.update('log.emerg', '', logFields, (err, res) => {
        //if (err)
        //    console.log(err);
    });
    return;
};

exports.alert = function(context, message='') {
    if (!isAllowedLogLevel('alert'))
        return;

    let logFields = {};
    logFields.Actions = context.stack.slice();
    if (context.getUser() !== undefined)
        logFields.User = context.getUser().username;

    if (message)
        logFields.message = message;

    context.service.update('log.alert', '', logFields, (err, res) => {
        //if (err)
        //    console.log(err);
    });
    return;
};

function isAllowedLogLevel(level) {
    const allLevel = ['emerg', 'alert', 'crit', 'err', 'warning', 'notice', 'info', 'debug'];
    const allowed = require('../../configs/general.js').loglevel;
    return allLevel.indexOf(level) <= allLevel.indexOf(allowed);
}
