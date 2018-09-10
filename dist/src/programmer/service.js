"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils = require("../utils");
var getTypeName = utils.getTypeName;
var isSimpleType = utils.isSimpleType;
var getTypePath = utils.getTypePath;
var getSwaggerType = utils.getSwaggerType;
exports.initSwagger = function (wr) {
    var base = {
        "swagger": "2.0",
        "basePath": "/v1/",
        "paths": {},
        "definitions": {},
        "info": {
            "version": "1.0.0",
            "title": "Swagger Hiihaa",
            "description": "A sample API that uses a petstore as an example to demonstrate features in the swagger-2.0 specification",
            "termsOfService": "http://swagger.io/terms/",
            "contact": {
                "name": "Swagger API Team"
            },
            "license": {
                "name": "MIT"
            }
        }
    };
    wr.setState(__assign({}, wr.getState(), { swagger: base }));
    return wr;
};
// write the service main file
exports.CreateServiceBase = function (wr, port) {
    if (port === void 0) { port = 1337; }
    // use express
    wr.out("const express = require('express')\nconst app = express()\nconst bodyParser = require('body-parser')\napp.use( bodyParser.json() ); \n", true);
    wr.createTag('imports');
    wr.out('', true);
    wr.out('// generated routes for the app ', true);
    // write service code a this point..
    var fork = wr.fork();
    wr.raw("\nif (!module.parent) {\n  app.listen(" + port + ");\n  console.log('listening on port " + port + "');\n}  \n  ", true);
    return fork;
};
exports.CreateClientBase = function (wr, port) {
    if (port === void 0) { port = 1337; }
    wr.out("\nimport axios from 'axios';\nimport {SomeReturnValue, TestUser, Device, InvalidIDError, CreateDevice } from '../../backend/models/model'\n", true);
    wr.createTag('imports');
    wr.out('', true);
    wr.out('// generated routes for the app ', true);
    wr.out('export class ClientInterface { ', true);
    wr.indent(1);
    // write service code a this point..
    var fork = wr.fork();
    wr.indent(-1);
    wr.out('}', true);
    return fork;
};
exports.WriteEndpoint = function (wr, p, cl, m) {
    var _a;
    var methodName = m.getName();
    var is_post = m.getParameters().filter(function (p) { return !isSimpleType(p.getType()); }).length > 0;
    var httpMethod = is_post ? 'post' : 'get';
    var methodDoc = '';
    var paramDocs = {};
    m.getJsDocs().forEach(function (doc) {
        if (doc.getComment()) {
            methodDoc = doc.getComment();
            console.log('COMMENT:', methodDoc);
        }
        doc.getTags().forEach(function (tag) {
            if (tag.getName() === 'param') {
                var cn = tag.compilerNode;
                paramDocs[cn.name.escapedText] = tag.getComment();
            }
        });
    });
    wr.out("// Service endpoint for " + methodName, true);
    switch (httpMethod) {
        case 'get':
            wr.out("app.get('/v1/" + methodName + "/" + m.getParameters().map(function (param) {
                return ':' + param.getName();
            }).join('/') + "', function( req, res ) {", true);
            wr.indent(1);
            var getParamsList = m.getParameters().map(function (param) { return 'req.params.' + param.getName(); }).join(', ');
            wr.out("res.json( service" + cl.getName() + "." + methodName + "(" + getParamsList + ") );", true);
            wr.indent(-1);
            wr.out("})", true);
            break;
        case 'post':
            wr.out("app.post('/v1/" + methodName + "/', function( req, res ) {", true);
            wr.indent(1);
            wr.out("res.json( service" + cl.getName() + "." + methodName + "(req.body) );", true);
            wr.indent(-1);
            wr.out("})", true);
            break;
    }
    var rArr = getTypePath(m.getReturnType());
    var is_array = rArr[0] === 'Array';
    var rType = rArr.pop();
    var successResponse = {};
    var definitions = {};
    var createClassDef = function (className) {
        p.getSourceFiles().forEach(function (s) {
            s.getClasses().forEach(function (cl) {
                if (cl.getName() === className) {
                    definitions[cl.getName()] = {
                        type: 'object',
                        properties: __assign({}, cl.getProperties().reduce(function (prev, curr) {
                            var _a;
                            return __assign({}, prev, (_a = {}, _a[curr.getName()] = {
                                'type': getTypeName(curr.getType())
                            }, _a));
                        }, {}))
                    };
                }
            });
        });
    };
    successResponse['200'] = {
        description: '',
        schema: __assign({}, getSwaggerType(rType, is_array))
    };
    createClassDef(rType);
    // generate swagger docs of this endpoin, a simple version so far
    var state = wr.getState().swagger;
    var validParams = m.getParameters(); // .filter( p => isSimpleType(p.getType()) )
    var axiosGetVars = httpMethod === 'get' ? validParams.map(function (p) { return ('{' + p.getName() + '}'); }).join('/') : '';
    state.paths['/' + methodName + '/' + axiosGetVars] = (_a = {},
        _a[httpMethod] = {
            "parameters": validParams.map(function (p) {
                if (httpMethod === 'post') {
                    var rArr_1 = getTypePath(p.getType());
                    var is_array_1 = rArr_1[0] === 'Array';
                    var rType_1 = rArr_1.pop();
                    var tDef = {
                        schema: __assign({}, getSwaggerType(rType_1, is_array_1))
                    };
                    if (isSimpleType(p.getType())) {
                        tDef = {
                            type: rType_1
                        };
                    }
                    else {
                        createClassDef(rType_1);
                    }
                    return __assign({ name: p.getName(), in: "body", description: paramDocs[p.getName()] || '', required: true }, tDef);
                }
                return {
                    name: p.getName(),
                    in: "path",
                    description: paramDocs[p.getName()] || '',
                    required: true,
                    type: getTypeName(p.getType())
                };
            }),
            "description": methodDoc,
            "summary": methodDoc,
            "produces": [
                "application/json"
            ],
            "responses": __assign({}, successResponse)
        },
        _a);
    state.definitions = Object.assign(state.definitions, definitions);
    return wr;
};
// write axios client endpoint for method
exports.WriteClientEndpoint = function (wr, p, cl, m) {
    var methodName = m.getName();
    // only simple parameters
    var validParams = m.getParameters();
    var is_post = m.getParameters().filter(function (p) { return !isSimpleType(p.getType()); }).length > 0;
    var httpMethod = is_post ? 'post' : 'get';
    // method signature
    var signatureStr = validParams.map(function (p) {
        return p.getName() + ": " + getTypeName(p.getType());
    }).join(', ');
    var paramsStr = validParams.map(function (p) { return p.getName(); }).join(', ');
    // setting the body / post varas is not as simple...
    var axiosGetVars = validParams.map(function (p) { return ('${' + p.getName() + '}'); }).join('/');
    switch (httpMethod) {
        case 'post':
            wr.out("// Service endpoint for " + methodName, true);
            wr.out("async " + methodName + "(" + signatureStr + ") : Promise<" + getTypeName(m.getReturnType()) + "> {", true);
            wr.indent(1);
            if (is_post)
                wr.out('// should be posted', true);
            wr.out('return (await axios.post(`/v1/' + methodName + '/`,' + paramsStr + ')).data;', true);
            wr.indent(-1);
            wr.out("}", true);
            break;
        case 'get':
            wr.out("// Service endpoint for " + methodName, true);
            wr.out("async " + methodName + "(" + signatureStr + ") : Promise<" + getTypeName(m.getReturnType()) + "> {", true);
            wr.indent(1);
            if (is_post)
                wr.out('// should be posted', true);
            wr.out('return (await axios.get(`/v1/' + methodName + '/' + axiosGetVars + '`)).data;', true);
            wr.indent(-1);
            wr.out("}", true);
    }
    return wr;
};
//# sourceMappingURL=service.js.map