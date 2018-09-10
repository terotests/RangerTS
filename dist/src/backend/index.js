"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('../../swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// generated routes for the app 
var api_1 = require("./api");
var serviceServerInterface = new api_1.ServerInterface();
// these are written automatically
function automaticServices(app) {
    // Service endpoint for getDevices
    app.get('/v1/getDevices/:id', function (req, res) {
        res.json(serviceServerInterface.getDevices(req.params.id));
    });
    // Service endpoint for allUsers
    app.get('/v1/allUsers/', function (req, res) {
        res.json(serviceServerInterface.allUsers());
    });
    // Service endpoint for users
    app.get('/v1/users/:id', function (req, res) {
        res.json(serviceServerInterface.users(req.params.id));
    });
    // Service endpoint for setDeviceData
    app.post('/v1/setDeviceData/', function (req, res) {
        res.json(serviceServerInterface.setDeviceData(req.body));
    });
    // Service endpoint for obj
    app.get('/v1/obj/:v', function (req, res) {
        res.json(serviceServerInterface.obj(req.params.v));
    });
    // Service endpoint for test2
    app.get('/v1/test2/:id', function (req, res) {
        res.json(serviceServerInterface.test2(req.params.id));
    });
    // Service endpoint for HelloWorld
    app.get('/v1/HelloWorld/:name', function (req, res) {
        res.json(serviceServerInterface.HelloWorld(req.params.name));
    });
    // Service endpoint for hello
    app.get('/v1/hello/:name', function (req, res) {
        res.json(serviceServerInterface.hello(req.params.name));
    });
}
automaticServices(app);
if (!module.parent) {
    app.listen(1337);
    console.log('listening on port 1337');
}
//# sourceMappingURL=index.js.map