export default {

    

    writeCookie(name, value, days) {
        let expires;

        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toGMTString();
        }
        else {
            expires = '';
        }

        document.cookie = name + '=' + value + expires + '; path=/';
    },

    getIntlMessage: function(messages, path) {
        const pathParts = path.split('.');
        let message;

        try {
            message = pathParts.reduce((obj, pathPart) => obj[pathPart], messages);
        } finally {
            if (message === undefined) {
                throw new ReferenceError('Could not find Intl message: ' + path);
            }
        }

        return message;
    },

    isEmpty: function(toTest) {
        return (toTest === undefined ||
            toTest === null ||
            toTest === '' ||
            (toTest instanceof Object && Object.keys(toTest).length === 0) ||
            (toTest instanceof Array && toTest.length === 0));
    },

    timeSince: function(date) {
        let seconds = Math.floor((new Date() - date) / 1000);
        let interval = Math.floor(seconds / 31536000);

        if (interval > 1) {
            return interval + ' years';
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + ' months';
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + ' days';
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + ' hours';
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + ' minutes';
        }
        return Math.floor(seconds) + ' seconds';
    },

    getBrowserLanguage: function() {
        let language =  navigator.browserLanguage ? navigator.browserLanguage : navigator.language;

        if (language.length === 2) {
            language += '-' + language.toUpperCase();
        }

        return language;
    },

    isLocalStorageOn: function() {
        let mod = 'react-count';
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    }    
};
