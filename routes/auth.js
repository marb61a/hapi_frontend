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
            const apiUrl = server.settings.app.apiBaseUrl + '/login/';
            
            Wreck.post(apiUrl,{
                payload : JSON.stringify(request.payload),
                json : true
            }, (err, res, payload) => {
                if(err){
                    throw err;
                }
                
                if(res.statusCode !== 200){
                    return reply.redirect('/login/');
                }
                
                request.cookieAuth.set(payload);

                return reply.redirect('/bookmarks');
            });
        }
    });
    
    server.route({
        method : 'GET',
        path : '/logout',
        handler : function(request, reply){
            request.cookieAuth.clear();
            
            return reply.redirect('/bookmarks');
        },
        config : {
            auth : 'session'
        }
    });
};

exports.register.attributes = {
    name: 'routes-auth'
};