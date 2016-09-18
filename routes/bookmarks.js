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
        
        return next();
    }    ;
};

exports.register.attributes = {
    name : 'routes-bookmarks'
};