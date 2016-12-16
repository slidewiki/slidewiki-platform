const clog = require('../configs/log').log;

export default {
    name: 'log',
    update: (req, resource, params, body, config, callback) => {
        let msg = '';
        if (body.msg) {
            const keys = Object.keys(body.msg);
            if (keys.length > 0) {
                for (let k of keys) {
                    msg += k + ':' + body.msg[k] + ', ';
                }
                msg = msg.slice(0, -2);
            }
        }
        else
            msg = [];

        switch(resource) {
            case 'log.silly':
                clog.silly({id: req.id, navStack: body.navStack, message: msg});
                break;
            case 'log.debug':
                clog.debug({id: req.id, navStack: body.navStack, message: msg});
                break;
            case 'log.info':
                clog.info({id: req.id, navStack: body.navStack, message: msg});
                break;
            case 'log.verbose':
                clog.verbose({id: req.id, navStack: body.navStack, message: msg});
                break;
            case 'log.warn':
                clog.warn({id: req.id, navStack: body.navStack, message: msg});
                break;
            case 'log.error':
                clog.error({id: req.id, navStack: body.navStack, message: msg});
                break;
        }
        return;
    }
};
