const log = require('../configs/log').log;

export default {
    name: 'log',
    update: (req, resource, params, body, config, callback) => {
        if (resource === 'log.debug') {
            console.log('From customlog debug');
        } else if (resource === 'log.info') {
            console.log('From customlog info');
        } else if (resource === 'log.warn') {
            console.log('From customlog warn');
        } else if (resource === 'log.error') {
            console.log(resource, params, config);
            console.log('From customlog error');
        }
    }
};
