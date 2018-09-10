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
// to generate swagger see
// https://github.com/OAI/OpenAPI-Specification/blob/master/examples/v2.0/json/petstore-minimal.json
/*
  "paths": {
    "/pets": {
      "get": {
        "description": "Returns all pets from the system that the user has access to",
        "produces": [
          "application/json"
        ],
        "responses": {
          "200": {
            "description": "A list of pets.",
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/Pet"
              }
            }
          }
        }
      }
    }
  },
*/
exports.initSwagger = function (wr) {
    var base = {
        "swagger": "2.0",
        "basePath": "/v1/",
        "paths": {},
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
    wr.out("const express = require('express')\nconst app = express()\n", true);
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
    wr.out("\nimport axios from 'axios';\nimport {SomeReturnValue, TestUser, Device, InvalidIDError } from '../../backend/models/model'\n", true);
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
/*
  "paths": {
    "/pets": {
      "get": {
        "description": "Returns all pets from the system that the user has access to",
        "produces": [
          "application/json"
        ],
        "responses": {
          "200": {
            "description": "A list of pets.",
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/Pet"
              }
            }
          }
        }
      }
    }
  },
*/
exports.WriteEndpoint = function (wr, cl, m) {
    var methodName = m.getName();
    // VPN 
    wr.out('', true);
    wr.out("// Service endpoint for " + methodName, true);
    wr.out("app.get('/v1/" + methodName + "/" + m.getParameters().map(function (param) {
        return ':' + param.getName();
    }).join('/') + "', function( req, res ) {", true);
    wr.indent(1);
    var paramsList = m.getParameters().map(function (param) { return 'req.params.' + param.getName(); }).join(', ');
    wr.out("res.json( service" + cl.getName() + "." + methodName + "(" + paramsList + ") );", true);
    wr.indent(-1);
    wr.out("})", true);
    // generate swagger docs of this endpoin, a simple version so far
    var state = wr.getState().swagger;
    state.paths['/' + methodName] = {
        "get": {
            "description": "no description",
            "produces": [
                "application/json"
            ],
            "responses": {
                "200": {
                    "description": "...",
                    "schema": {
                        "type": "array",
                        "items": {
                            "$ref": "#/definitions/Pet"
                        }
                    }
                }
            }
        }
    };
    return wr;
};
// write axios client endpoint for method
exports.WriteClientEndpoint = function (wr, p, cl, m) {
    var methodName = m.getName();
    // get function valid parameters...
    var validParams = m.getParameters().filter(function (p) {
        var t = p.getType();
        if (t.compilerType.symbol) {
            return false;
        }
        return true;
    });
    // method signature
    var signatureStr = validParams.map(function (p) {
        var t = p.getType();
        var typename = t.getText();
        if (t.compilerType.symbol) {
            typename = t.compilerType.symbol.escapedName + '';
        }
        return p.getName() + ": " + typename;
    }).join(', ');
    // setting the body / post varas is not as simple...
    var axiosGetVars = validParams.map(function (p) {
        var t = p.getType();
        var typename = t.getText();
        if (t.compilerType.symbol) {
            typename = t.compilerType.symbol.escapedName + '';
        }
        return '${' + p.getName() + '}';
    }).join('/');
    wr.out("// Service endpoint for " + methodName, true);
    wr.out("async " + methodName + "(" + signatureStr + ") : Promise<" + utils.getMethodReturnTypeName(p.getTypeChecker(), m) + "> {", true);
    wr.indent(1);
    wr.out('return (await axios.get(`/v1/' + methodName + '/' + axiosGetVars + '`)).data;', true);
    wr.indent(-1);
    wr.out("}", true);
    return wr;
};
//# sourceMappingURL=service.js.map