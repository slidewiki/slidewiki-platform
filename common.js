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
            language += '_' + language.toUpperCase();
        }
        else {
            language = language.replace('-', '_');
        }

        return language;
    },

    getIntlLanguage() {
        let language = 'en';
        if (document.cookie.indexOf('locale=') > 0)
            language = document.cookie.substr(document.cookie.indexOf('locale=') + 7, 2);

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
    },

    arraysEqual: (arr1, arr2) => {
        if (arr1.length !== arr2.length)
            return false;
        for(let i = arr1.length; i--;) {
            if(arr1[i] !== arr2[i])
                return false;
        }

        return true;
    },

    arraysContainTheSameIdsInTheirObjects: (a, b) => {
        if (a === undefined && b === undefined)
            return true;
        if ((a === undefined && b !== undefined) || (a !== undefined && b === undefined))
            return false;
        if (a.length !== b.length)
            return false;
        for (let key in a) {
            const element = a[key];
            const found = b.findIndex((e) => {return e.id === element.id;}) !== -1;
            if (!found)
                return false;
        }
        for (let key in b) {
            const element = b[key];
            const found = a.findIndex((e) => {return e.id === element.id;}) !== -1;
            if (!found)
                return false;
        }
        return true;
    },

    isEmailAddress: (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },

    equals: function(x, y) {
        if (x === y) return true;
        // if both x and y are null or undefined and exactly the same

        if (! (x instanceof Object) || ! (y instanceof Object)) return false;
        // if they are not strictly equal, they both need to be Objects

        if (x.constructor !== y.constructor) return false;
        // they must have the exact same prototype chain, the closest we can do is
        // test there constructor.

        for (var p in x) {
            if (! x.hasOwnProperty(p)) continue;
            // other properties were tested using x.constructor === y.constructor

            if (! y.hasOwnProperty(p)) return false;
            // allows to compare x[p] and y[p] when set to undefined

            if (x[p] === y[p]) continue;
            // if they have the same strict value or identity then they are equal

            if (typeof(x[p]) !== 'object') return false;
            // Numbers, Strings, Functions, Booleans must be strictly equal

            if (! exports.default.equals(x[p], y[p])) return false;
            // Objects and Arrays must be tested recursively
        }

        for (p in y) {
            if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;
            // allows x[p] to be set to undefined
        }

        return true;
    },
};
