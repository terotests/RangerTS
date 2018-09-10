"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var app = express();
// generated routes for the app 
var api_1 = require("./api");
var serviceServerInterface = new api_1.ServerInterface();
// these are written automatically
function automaticServices(app) {
    // Service endpoint for getAllDevices2
    app.get('/v1/getAllDevices2/:id', function (req, res) {
        res.json(serviceServerInterface.getAllDevices2(req.params.id));
    });
    // Service endpoint for users
    app.get('/v1/users/:id', function (req, res) {
        res.json(serviceServerInterface.users(req.params.id));
    });
    // Service endpoint for jee
    app.get('/v1/jee/:x/:y/:ss/:z/:requestBody', function (req, res) {
        res.json(serviceServerInterface.jee(req.params.x, req.params.y, req.params.ss, req.params.z, req.params.requestBody));
    });
    // Service endpoint for obj
    app.get('/v1/obj/:v', function (req, res) {
        res.json(serviceServerInterface.obj(req.params.v));
    });
    // Service endpoint for HelloWorld
    app.get('/v1/HelloWorld/:name', function (req, res) {
        res.json(serviceServerInterface.HelloWorld(req.params.name));
    });
}
automaticServices(app);
if (!module.parent) {
    app.listen(1337);
    console.log('listening on port 1337');
}
//# sourceMappingURL=index.js.map