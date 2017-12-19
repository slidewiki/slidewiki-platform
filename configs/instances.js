export default {
    org: {
        url: 'https://slidewiki.org',
        emailcheck: 'https://userservice.slidewiki.org/information/email/',
        entry: 'https://slidewiki.org/SSO',
        login: 'https://userservice.slidewiki.org/login',
        validate: 'https://userservice.slidewiki.org/social/provider/slidewiki',
        userinfo: 'https://userservice.slidewiki.org/user/{id}/profile',
        finalize: 'https://userservice.slidewiki.org/social/finalize/{hash}'
    },
    aksw: {
        url: 'https://slidewiki.aksw.org',
        emailcheck: 'https://userservice.slidewiki.aksw.org/information/email/',
        entry: 'https://slidewiki.aksw.org/SSO',
        login: 'https://userservice.slidewiki.aksw.org/login',
        validate: 'https://userservice.slidewiki.aksw.org/social/provider/slidewiki',
        userinfo: 'https://userservice.slidewiki.aksw.org/user/{id}/profile',
        finalize: 'https://userservice.slidewiki.aksw.org/social/finalize/{hash}'
    },
    exp: {
        url: 'https://platform.experimental.slidewiki.org',
        emailcheck: 'https://userservice.experimental.slidewiki.org/information/email/',
        entry: 'https://platform.experimental.slidewiki.org/SSO',
        login: 'https://userservice.experimental.slidewiki.org/login',
        validate: 'https://userservice.experimental.slidewiki.org/social/provider/slidewiki',
        userinfo: 'https://userservice.experimental.slidewiki.org/user/{id}/profile',
        finalize: 'https://userservice.experimental.slidewiki.org/social/finalize/{hash}'
    },
    local: {
        url: 'http://localhost:3000',
        emailcheck: 'http://localhost:1500/information/email/',
        entry: 'http://localhost:3000/SSO',
        login: 'http://localhost:1500/login',
        validate: 'http://localhost:1500/social/provider/slidewiki',
        userinfo: 'http://localhost:1500/user/{id}/profile',
        finalize: 'http://localhost:1500/social/finalize/{hash}'
    },
    _self: 'local'
};
