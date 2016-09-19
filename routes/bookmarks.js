'use strict';

const Wreck = require('wreck');
const Joi = require('joi');

exports.register = function(server, options, next){
    const _extractErrorDetails = function(error){
        const errors = {};
        const errorDetails = error.data.details;
        
        errorDetails.forEach(errorDetail => {
            if(!errors.hasOwnProperty(errorDetail.path)){
                errors[errorDetail.path] = errorDetail.message;
            }
        });
        
        return errors;
    };
    
    server.route({
        method : 'GET',
        path: '/bookmarks',
        handler : function(request, reply){
            const apiUrl = server.settings.app.apiBaseUrl + '/bookmarks?sort=' + request.query.sort;
            
            Wreck.get(apiUrl, {
                json : true
            }, (err, res, payload) => {
                if(err){
                    throw err;
                }
                
                return reply.view('index', {
                    bookmarks : payload
                });
            });
        },
        config : {
            validate : {
                query : {
                    sort: Joi.string().valid('top', 'new').default('top')
                }
            }
        }
    });
    
    server.route({
        method : 'GET',
        path : '/bookmarks/add',
        handler : function(request, reply){
            return reply.view('form', {
                edit : false
            });
        },
        config :{
            auth : 'session'
        }
    });
    
    server.route({
        method : 'POST',
        path : '/bookmarks',
        handler : function(request, reply){
            const apiUrl = server.settings.app.apiBaseUrl + '/bookmarks';
            const token = request.auth.credentials.token;
            
            Wreck.post(apiUrl, {
                payload : JSON.stringify(request.payload),
                json : true,
                headers : {
                    'Authorization': 'Bearer ' + token
                }
            }, (err, res, payload) => {
                if(err){
                    throw err;
                }
                
                return reply.redirect('/bookmarks');
            });
        },
        config : {
            
        }
    });
};

exports.register.attributes = {
    name : 'routes-bookmarks'
};