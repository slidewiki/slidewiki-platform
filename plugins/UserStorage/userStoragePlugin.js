import cookie from 'cookie';

module.exports = function userStoragePlugin(options) {
    /**
     * @class userStorage
     */
    return {
        name: 'UserStoragePlugin',
        // Called after context creation to dynamically create a context plugin
        plugContext: function plugContext(contextOptions) {
            // `options` is the same as what is passed into `Fluxible.createContext(options)`
            let user = null;
            if (contextOptions.req) {
                user = contextOptions.req.user;
            }
            const user_cookieName = 'user_json_storage';

            //original from fluxible-plugin-cookie
            let req = contextOptions.req;
            let res = contextOptions.res;

            //get cookies from cookie-parser plugin
            let cookies = req ? req.cookies : cookie.parse(document.cookie);

            // Returns a context plugin
            return {
                /**
                 * Provides full access to the user in the action context
                 * @param {Object} actionContext
                 */
                plugActionContext: function plugActionContext(actionContext) {
                    actionContext.getUser = function () {
                        let result = user;

                        if (result === undefined || result === null || result === {}) {
                            result = actionContext.getCookie(user_cookieName);
                        }

                        return result;
                    };
                    actionContext.setUser = function (newUser) {
                        user = newUser;

                        actionContext.setCookie(user_cookieName, JSON.stringify(newUser), {});
                    };
                    actionContext.setCookie = function (name, value, options) {
                        const cookieStr = cookie.serialize(name, value, options);
                        if (res) {
                            res.setHeader('Set-Cookie', cookieStr);
                        } else {
                            document.cookie = cookieStr;
                        }
                        cookies[name] = value;
                    };
                    actionContext.getCookie = function (name) {
                        return cookies[name];
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
