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
            auth : 'session',
            validate :{
                payload : {
                    title : Joi.string().min(1).max(100).required(),
                    url : Joi.string().uri().required
                },
                options : {
                    abortEarly : false
                },
                failAction : function(request, reply, source, error){
                    const errors = _extractErrorDetails(error);
                    
                    return reply.view('form', {
                        errors : errors,
                        values : request.payload,
                        edit : false
                    }).code(400);
                }
            }
        }
    });
    
    server.route({
        method : 'GET',
        path :'/bookmarks/{id}/edit',
        handler : function(request, reply){
            const apiUrl = server.settings.app.apiBaseUrl + '/bookmarks/' + request.params.id;
            
            Wreck.get(apiUrl, {
                json : true
            }, (err, res, payload) => {
                if(err){
                    throw err;
                }
                return reply.view('form', {
                    values: payload,
                    edit: true
                });
            });
        },
        config : {
            auth : 'session'
        }
    });
    
    server.route({
        method : 'POST',
        path : '/bookmarks/id',
        handler : function(request, reply){
            const apiUrl = server.settings.app.apiBaseUrl + '/bookmarks/' + request.params.id;
            const token = request.auth.credentials.token;
            
            Wreck.patch(apiUrl, {
                payload : JSON.stringify(request.payload),
                json : true,
                headers : {
                    'Authorization' : 'Bearer ' + token
                }
            }, (err, res, payload) => {
                if (err) {
                    throw err;
                }

                return reply.redirect('/bookmarks');
            });
        },
        config : {
            auth : 'session',
            validate : {
                payload : {
                    title: Joi.string().min(1).max(100).required(),
                    url: Joi.string().uri().required()
                },
                options : {
                    abortEarly : false
                },
                failAction : function(request, reply, source, error){
                    const errors = _extractErrorDetails(error);
                    const values = request.payload
                    
                    values.id = request.params.id;
                    
                    return reply.view('form', {
                            errors: errors,
                            values: values,
                            edit: true
                        }).code(400);
                }
            }
        }
    });
    
    server.route({
        method  : 'GET',
        path : '/bookmarks/{id}/delete',
        handler : function(request, reply){
            const apiUrl = server.settings.app.apiBaseUrl + '/bookmarks/' + request.params.id;
            const token = request.auth.credentials.token;
            
            Wreck.delete(apiUrl, {
                json : true,
                headers : {
                    'Authorization' : 'Bearer ' + token
                },
            }, (err, res, payload) => {
                if(err){
                    throw err;
                }
                
                return reply.redirect('/bookmarks');
            });
        },
        config : {
            auth : 'session'
        }
    });
    
    server.route({
        method : 'GET',
        path : '/bookmarks/{id}/upvote',
        handler : function(request, reply){
            const apiUrl = server.settings.app.apiBaseUrl + '/bookmarks/' + request.params.id + '/upvote';
            const token = request.auth.credentials.token;
            
            Wreck.post(apiUrl, {
                json : true,
                headers : {
                    'Authorization' : 'Bearer ' + token    
                }
            }, (err, res, payload) => {
                if(err){
                    throw err;
                }
                
                return reply.redirect('/bookmarks');
            });
        },
        config : {
            auth : 'session'
        }
    });
    
    return next();
};

exports.register.attributes = {
    name : 'routes-bookmarks'
};