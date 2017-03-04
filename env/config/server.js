"use strict";

module.exports = {
    dev: (process.env.NODE_ENV === 'development'),
    dest: (process.env.NODE_ENV === 'development') ? 'dev' : process.env.NODE_ENV,
    root: './' + ((process.env.NODE_ENV === 'development') ? '' : process.env.NODE_ENV),
    servers: {
        hapi: {
            development: true,
            production: true,
            config: {
                host: 'localhost',
                port: 8050,
                secret: 'UNSAFE: CHANGE ME',
                routes: require('./hapi/routes')
            }

        }
    }
};
