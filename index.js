'use strict';

const Hapi = require("hapi");

// Create a server and a connection 
const server = new  Hapi.server({
    app : {
        apiBaseUrl: 'http://localhost:3000'
    }
});

server.connection({
    port : 4000
});

// Register good plugin and start the server
server.register([{
    register : require("good"),
    options : {
        reporters : {
            console : [{
                module : 'good-squeeze',
                name : 'Squeeze',
                args : [{
                    log: '*',
                    response: '*'
                }]
            }, {
                module: 'good-console'    
            }, 'stdout']
        }
    }
}, {
    register: require('inert')
}, {
    register: require('vision')
}, {
    register: require('hapi-auth-cookie')
}, {
    register: require('./plugins/error')
}, {
    register: require('./plugins/auth')
}, {
    register: require('./routes/bookmarks')
}, {
    register: require('./routes/auth')
}], (err) => {
    if(err){
        throw err;
    }
    
    // Serve static assets(images, css, js)
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: './public',
                redirectToSlash: true
            }
        }
    });
}

);