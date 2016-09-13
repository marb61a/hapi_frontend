'use strict';

const Wreck = require("wreck");

exports.register = function(server, options, next){
    server.route({
        method : 'GET',
        path : '/login',
        handler : function(request, reply){
            return reply.view('login');
        }
    });
    
    server.route({
        method: 'POST',
        path: '/login',
        handler : function(request, reply){
            
        }
    });
};

exports.register.attributes = {
    name: 'routes-auth'
};