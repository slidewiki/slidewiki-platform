import cookie from 'js-cookie';

module.exports = function userStoragePlugin(options) {
    /**
     * @class userStorage
     * Extends the flux context with function to use cookies and save and retrieve a user Object.
     */
    return {
        name: 'UserStoragePlugin',
        // Called after context creation to dynamically create a context plugin
        plugContext: function plugContext(contextOptions) {
            // `options` is the same as what is passed into `Fluxible.createContext(options)`
            let user = undefined;
            const user_cookieName = 'user_json_storage';

            //original from fluxible-plugin-cookie
            let req = contextOptions.req;
            let res = contextOptions.res;

            //get cookies from cookie-parser plugin
            let cookies = req ? req.cookies : cookie.get();

            const secondsCookieShouldBeValid = 60*60*24*14 ;  //2 weeks
            let createExpire = () => {
                let now = new Date();
                let time = now.getTime();
                let expireTime = time + 1000*secondsCookieShouldBeValid;
                now.setTime(expireTime);

                return now;
            };

            //get user from cookies if undefined
            if (user === undefined && cookies !== undefined && cookies[user_cookieName] !== undefined)
                user = cookie.getJSON(user_cookieName);

            console.log('UserStoragePlugin plugContext:', cookies, res ? 'result is defined - server-side' : 'res is undefined - client-side', user);

            // Returns a context plugin
            return {
                /**
                 * Provides full access to the user in the action context
                 * @param {Object} actionContext
                 */
                plugActionContext: function plugActionContext(actionContext) {
                    actionContext.getUser = function () {
                        console.log('userStoragePlugin actionContext getUser()');

                        let result = user;

                        if (result === undefined || result === null || result === {}) {
                            result = cookie.getJSON(user_cookieName);
                            console.log('userStoragePlugin actionContext getUser: got user from cookies');
                        }

                        return result;
                    };
                    actionContext.setUser = function (newUser) {
                        if (typeof newUser !== 'object')
                            return;

                        user = newUser;

                        cookie.set(user_cookieName, newUser,{
                            expires: createExpire(),
                            maxAge: secondsCookieShouldBeValid
                        });
                    };
                    actionContext.deleteUser = function() {
                        user = {};

                        cookie.remove(user_cookieName);
                    };
                    actionContext.setCookie = function (name, value, options) {
                        console.log('userStoragePlugin actionContext setCookie:', name, value, options);
                        const cookieStr = cookie.set(name, value, options);
                        cookies[name] = value;
                    };
                    actionContext.getCookie = function (name) {
                        return cookies[name] ? cookies[name] : cookie.get(name);
                    };
                },
                /**
                 * Provides access to user
                 * @param {Object} componentContext
                 */
                plugComponentContext: function plugComponentContext(componentContext) {
                    componentContext.getUser = function () {
                        return user;
                    };
                },
                /**
                 * Provides access to user
                 * @param {Object} storeContext
                 */
                plugStoreContext: function plugStoreContext(storeContext) {
                    storeContext.getUser = function () {
                        return user;
                    };
                },
                dehydrate: function () {
                    return {
                        user: user
                    };
                },
                // Called on client to rehydrate the context plugin settings
                rehydrate: function (state) {
                    user = state.user;
                }
            };
        },

    };
};
