'use strict';

exports.register = function (server, options, next) {

    server.auth.strategy('session', 'cookie', 'optional', {
        password: 'abcd1234',
        isSecure: false
    });

    return next();
};

exports.register.attributes = {
    name: 'auth'
};