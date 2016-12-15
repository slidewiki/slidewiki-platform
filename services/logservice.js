const clog = require('../configs/log').log;

export default {
    name: 'log',
    update: (req, resource, params, body, config, callback) => {
        consolo.log(params);
        const message = params.msg === '' ? 'Hey' : params.msg;

        if (resource === 'log.debug') {
            console.debug('From customlog debug');
        } else if (resource === 'log.info') {
            clog.info({id: req.id, navStack: params.navStack, message: params.msg});
        } else if (resource === 'log.warn') {
            console.warn('From customlog warn');
        } else if (resource === 'log.error') {
            clog.error({id: req.id, navStack: params.navStack, message: params.msg});
            //console.error(resource, params, config);
            console.log('From customlog error');
        }
    }
};
