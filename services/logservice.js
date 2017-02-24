const clog = require('../configs/log').log;

export default {
    name: 'log',
    update: (req, resource, params, body, config, callback) => {
        if (req.reqId === 'undefined' || !req.reqId)
            req.reqId = -1;

        let logObject = {Id: req.reqId, message: body};

        switch(resource) {
            case 'log.debug':
                clog.debug(logObject);
                break;
            case 'log.info':
                clog.info(logObject);
                break;
            case 'log.notice':
                clog.notice(logObject);
                break;
            case 'log.warning':
                clog.warning(logObject);
                break;
            case 'log.error':
                clog.error(logObject);
                break;
            case 'log.crit':
                clog.crit(logObject);
                break;
            case 'log.alert':
                clog.alert(logObject);
                break;
            case 'log.emerg':
                clog.emerg(logObject);
                break;
        }
        return;
    }
};
