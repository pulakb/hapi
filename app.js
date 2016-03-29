var Hapi = require('hapi');
var mongojs = require('mongojs');

var server = new Hapi.Server();
server.connection({port: 7002});

server.register({
    register: require('hapi-swagger'),
    options: {
        apiVersion: "0.0.1"
    }
}, function (err) {
    if (err) {
        server.log(['error'], 'hapi-swagger load error: '+ err);
    } else {
        server.log(['start'], 'hapi-swagger interface loadedd');
    }
});

server.route({
    method: 'GET',
    path: '/api/user',
    handler: function (request, reply) {
        reply({
            statusCode: 200,
            message: 'Getting all user Data',
            data: [
                {
                    name: 'Kashis',
                    age: 24
                },
                {
                    name: 'Shubham',
                    age: 21
                },
                {
                    name: 'Jasmine',
                    age: 24
                }
            ]
        });
    }
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});

server.app.db = mongojs('hapi-rest-mongo');