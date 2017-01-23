const clog = require('../configs/log').log;

export default {
    name: 'log',
    update: (req, resource, params, body, config, callback) => {
        if (!req.id)
            req.id = '-1';

        let msg = '';
        if (body.msg) {
            const keys = Object.keys(body.msg);
            if (keys.length > 0) {
                for (let k of keys) {
                    msg += k + ':' + body.msg[k] + ', ';
                }
                msg = msg.slice(0, -2);
            }
            else
                msg = body.msg;
        }
        else
            msg = [];

        switch(resource) {
            case 'log.debug':
                clog.debug({id: req.id, navStack: body.navStack, message: msg});
                break;
            case 'log.info':
                clog.info({id: req.id, navStack: body.navStack, message: msg});
                break;
            case 'log.notice':
                clog.notice({id: req.id, navStack: body.navStack, message: msg});
                break;
            case 'log.warning':
                clog.warning({id: req.id, navStack: body.navStack, message: msg});
                break;
            case 'log.error':
                clog.error({id: req.id, navStack: body.navStack, message: msg});
                break;
            case 'log.crit':
                clog.crit({id: req.id, navStack: body.navStack, message: msg});
                break;
            case 'log.alert':
                clog.alert({id: req.id, navStack: body.navStack, message: msg});
                break;
            case 'log.emerg':
                clog.emerg({id: req.id, navStack: body.navStack, message: msg});
                break;
        }
        return;
    }
};
