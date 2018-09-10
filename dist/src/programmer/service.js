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
exports.WriteEndpoint = function (wr, p, cl, m) {
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
    var rArr = getTypePath(m.getReturnType());
    var is_array = rArr[0] === 'Array';
    var rType = rArr.pop();
    var successResponse = {};
    var definitions = {};
    p.getSourceFiles().forEach(function (s) {
        s.getClasses().forEach(function (cl) {
            if (cl.getName() === rType) {
                console.log('END returns class ', cl.getName(), is_array);
                // create datatype
                definitions[cl.getName()] = {
                    type: 'object',
                    properties: __assign({}, cl.getProperties().reduce(function (prev, curr) {
                        var _a;
                        return __assign({}, prev, (_a = {}, _a[curr.getName()] = {
                            'type': getTypeName(curr.getType())
                        }, _a));
                    }, {}))
                };
                if (is_array) {
                    successResponse['200'] = {
                        description: '',
                        schema: {
                            type: 'array',
                            items: '#/definitions/' + cl.getName()
                        }
                    };
                }
            }
        });
    });
    // const clDecl = p.getCl
    // Find the class declaration...
    /*
        "NewPet": {
          "type": "object",
          "required": [
            "name"
          ],
          "properties": {
            "name": {
              "type": "string"
            },
            "tag": {
              "type": "string"
            }
          }
        },
    */
    // generate swagger docs of this endpoin, a simple version so far
    var state = wr.getState().swagger;
    var validParams = m.getParameters().filter(function (p) { return isSimpleType(p.getType()); });
    var axiosGetVars = validParams.map(function (p) { return ('{' + p.getName() + '}'); }).join('/');
    var paramList = 
    /*
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "description": "ID of pet to fetch",
          "required": true,
          "type": "integer",
          "format": "int64"
        }
      ],
    */
    /*
      "responses": {
        "200": {
          "description": "pet response",
          "schema": {
            "type": "array",
            "items": {
              "$ref": "#/definitions/Pet"
            }
          }
        },
        "default": {
          "description": "unexpected error",
          "schema": {
            "$ref": "#/definitions/Error"
          }
        }
      }
    */
    state.paths['/' + methodName + '/' + axiosGetVars] = {
        "get": {
            "parameters": validParams.map(function (p) {
                return {
                    name: p.getName(),
                    in: "path",
                    description: '',
                    required: true,
                    type: getTypeName(p.getType())
                };
            }),
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
                            "$ref": "#/definitions/" + rType
                        }
                    }
                }
            }
        }
    };
    state.definitions = Object.assign(state.definitions, definitions);
    return wr;
};
// write axios client endpoint for method
exports.WriteClientEndpoint = function (wr, p, cl, m) {
    var methodName = m.getName();
    // only simple parameters
    var validParams = m.getParameters().filter(function (p) { return isSimpleType(p.getType()); });
    // method signature
    var signatureStr = validParams.map(function (p) {
        return p.getName() + ": " + getTypeName(p.getType());
    }).join(', ');
    // setting the body / post varas is not as simple...
    var axiosGetVars = validParams.map(function (p) { return ('${' + p.getName() + '}'); }).join('/');
    wr.out("// Service endpoint for " + methodName, true);
    wr.out("async " + methodName + "(" + signatureStr + ") : Promise<" + utils.getMethodReturnTypeName(p.getTypeChecker(), m) + "> {", true);
    wr.indent(1);
    wr.out('return (await axios.get(`/v1/' + methodName + '/' + axiosGetVars + '`)).data;', true);
    wr.indent(-1);
    wr.out("}", true);
    return wr;
};
//# sourceMappingURL=service.js.map