"use strict"

exports.register = function(server, options, next){
    server.ext ('onPreResponse', (request, reply) => {
        const response = request.response;
        
        if(response.isBoom){
            const statusCode = response.output.payload.statusCode;
            const errorTitle = response.output.payload.error;

            return reply.view('error', {
                statusCode: statusCode,
                errorTitle: errorTitle
            }, {
                layout: false
            }).code(statusCode);    
        }
        
        return reply.continue();
    });
    
    return next();
};

exports.register.attributes = {
    name: 'error'
};