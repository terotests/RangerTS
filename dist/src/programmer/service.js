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
var getMethodDoc = utils.getMethodDoc;
exports.initSwagger = function (wr) {
    var services = wr.getState().services;
    var service = services[Object.keys(services).pop()];
    var base = {
        "swagger": "2.0",
        "basePath": service.endpoint || '/v1/',
        "paths": {},
        "definitions": {},
        "info": {
            "version": "1.0.0",
            "title": service.title || '',
            "description": service.description || '',
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
    wr.out("\nimport axios from 'axios';\nimport {\n  CreateUser,\n  SomeReturnValue, \n  TestUser, \n  Device, \n  InvalidIDError, \n  CreateDevice } from '../../backend/models/model'\n", true);
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
exports.WriteEndpoint = function (wr, project, clName, method) {
    var _a;
    var methodName = method.getName();
    var getParams = method.getParameters().filter(function (param) { return isSimpleType(param.getType()); });
    var postParams = method.getParameters().filter(function (param) { return !isSimpleType(param.getType()); });
    var is_post = method.getParameters().filter(function (project) { return !isSimpleType(project.getType()); }).length > 0;
    var httpMethod = is_post ? 'post' : 'get';
    var getParamStr = getParams.map(function (param) {
        return ':' + param.getName();
    }).join('/');
    var methodInfo = getMethodDoc(method);
    var getMethodAlias = function () {
        return methodInfo.params.alias || methodName;
    };
    var getHTTPMethod = function () {
        return methodInfo.params.method || httpMethod;
    };
    wr.out("// Service endpoint for " + methodName, true);
    wr.out("app." + getHTTPMethod() + "('/v1/" + getMethodAlias() + "/" + getParamStr + "', function( req, res ) {", true);
    wr.indent(1);
    var argParams = getParams.map(function (param) { return 'req.params.' + param.getName(); });
    var postArgs = postParams.length > 0 ? ['req.body'] : [];
    var paramList = argParams.concat(postArgs).join(',');
    wr.out("res.json( service" + clName.getName() + "." + methodName + "(" + paramList + ") );", true);
    wr.indent(-1);
    wr.out("})", true);
    var rArr = getTypePath(method.getReturnType());
    var is_array = rArr[0] === 'Array';
    var rType = rArr.pop();
    var successResponse = {};
    var definitions = {};
    var createClassDef = function (className) {
        project.getSourceFiles().forEach(function (s) {
            s.getClasses().forEach(function (clName) {
                if (clName.getName() === className) {
                    definitions[clName.getName()] = {
                        type: 'object',
                        properties: __assign({}, clName.getProperties().reduce(function (prev, curr) {
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
    var validParams = method.getParameters();
    var axiosGetVars = getParams.map(function (param) { return ('{' + param.getName() + '}'); }).join('/');
    state.paths['/' + getMethodAlias() + '/' + axiosGetVars] = (_a = {},
        _a[getHTTPMethod()] = {
            "parameters": getParams.map(function (param) {
                return {
                    name: param.getName(),
                    in: "path",
                    description: methodInfo.params[param.getName()] || '',
                    required: true,
                    type: getTypeName(param.getType())
                };
            }).concat(postParams.map(function (param) {
                var rArr = getTypePath(param.getType());
                var is_array = rArr[0] === 'Array';
                var rType = rArr.pop();
                var tDef = {
                    schema: __assign({}, getSwaggerType(rType, is_array))
                };
                if (isSimpleType(param.getType())) {
                    tDef = {
                        type: rType
                    };
                }
                else {
                    createClassDef(rType);
                }
                return __assign({ name: param.getName(), in: "body", description: methodInfo.params[param.getName()] || '', required: true }, tDef);
            })),
            "description": methodInfo.params.description || methodInfo.comment,
            "summary": methodInfo.params.summary || methodInfo.params.description || methodInfo.comment,
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
exports.WriteClientEndpoint = function (wr, project, clName, method) {
    var methodName = method.getName();
    // only simple parameters
    var validParams = method.getParameters();
    var getParams = method.getParameters().filter(function (param) { return isSimpleType(param.getType()); });
    var postParams = method.getParameters().filter(function (param) { return !isSimpleType(param.getType()); });
    var is_post = method.getParameters().filter(function (project) { return !isSimpleType(project.getType()); }).length > 0;
    var httpMethod = is_post ? 'post' : 'get';
    // method signature
    var signatureStr = validParams.map(function (project) {
        return project.getName() + ": " + getTypeName(project.getType());
    }).join(', ');
    var paramsStr = getParams.map(function (project) { return project.getName(); }).join(', ');
    var postParamsStr = postParams.map(function (project) { return project.getName(); }).join(', ');
    // setting the body / post varas is not as simple...
    var axiosGetVars = getParams.map(function (param) { return ('${' + param.getName() + '}'); }).join('/');
    var methodInfo = getMethodDoc(method);
    if (methodInfo.params.method) {
        httpMethod = methodInfo.params.method;
    }
    if (methodInfo.params.alias) {
        methodName = methodInfo.params.alias;
    }
    switch (httpMethod) {
        case 'post':
            wr.out("// Service endpoint for " + methodName, true);
            wr.out("async " + methodName + "(" + signatureStr + ") : Promise<" + getTypeName(method.getReturnType()) + "> {", true);
            wr.indent(1);
            if (is_post)
                wr.out('// should be posted', true);
            wr.out('return (await axios.post(`/v1/' + methodName + '/' + axiosGetVars + '`,' + postParamsStr + ')).data;', true);
            wr.indent(-1);
            wr.out("}", true);
            break;
        case 'get':
            wr.out("// Service endpoint for " + methodName, true);
            wr.out("async " + methodName + "(" + signatureStr + ") : Promise<" + getTypeName(method.getReturnType()) + "> {", true);
            wr.indent(1);
            if (is_post)
                wr.out('// should be posted', true);
            wr.out('return (await axios.get(`/v1/' + methodName + '/' + axiosGetVars + '`)).data;', true);
            wr.indent(-1);
            wr.out("}", true);
            break;
        default:
            wr.out("// Service endpoint for " + methodName, true);
            wr.out("async " + methodName + "(" + signatureStr + ") : Promise<" + getTypeName(method.getReturnType()) + "> {", true);
            wr.indent(1);
            if (is_post)
                wr.out('// should be posted', true);
            wr.out('return (await axios.' + httpMethod + '(`/v1/' + methodName + '/' + axiosGetVars + '`)).data;', true);
            wr.indent(-1);
            wr.out("}", true);
    }
    return wr;
};
//# sourceMappingURL=service.js.map