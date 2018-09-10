import * as R from 'robowr'
import { MethodDeclaration, ClassDeclaration, Project } from 'ts-simple-ast'
import * as utils from '../utils'

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
export const initSwagger = (wr:R.CodeWriter) : R.CodeWriter => {
  const base = {  
    "swagger": "2.0",
    "basePath": "/v1/",
    "paths" : {

    },
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
  } 
  wr.setState( {
    ...wr.getState(),
    swagger : base 
  })
  return wr
}

// write the service main file
export const CreateServiceBase = (wr:R.CodeWriter, port:number = 1337) : R.CodeWriter => {

  // use express
  wr.out(
`const express = require('express')
const app = express()
`, true)

  wr.createTag('imports')

  wr.out('', true)
  wr.out('// generated routes for the app ', true)

  // write service code a this point..
  const fork = wr.fork()

  wr.raw(`
if (!module.parent) {
  app.listen(${port});
  console.log('listening on port ${port}');
}  
  `, true)
  return fork;
}

export const CreateClientBase = (wr:R.CodeWriter, port:number = 1337) : R.CodeWriter => {
  wr.out(`
import axios from 'axios';
import {SomeReturnValue, TestUser, Device, InvalidIDError } from '../../backend/models/model'
`, true)

  wr.createTag('imports')

  wr.out('', true)
  wr.out('// generated routes for the app ', true)
  wr.out('export class ClientInterface { ', true)
  wr.indent(1)
  // write service code a this point..
  const fork = wr.fork()
  wr.indent(-1)
  wr.out('}', true)
  return fork;
}


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
export const WriteEndpoint = (wr:R.CodeWriter, cl:ClassDeclaration, m:MethodDeclaration ) : R.CodeWriter => {

  const methodName = m.getName()

  // VPN 
  wr.out('', true);
  wr.out(`// Service endpoint for ${methodName}`, true);
  wr.out(`app.get('/v1/${methodName}/${m.getParameters().map( param=> {
    return ':' + param.getName();
  }).join('/')}', function( req, res ) {`, true)
  wr.indent(1)
    const paramsList = m.getParameters().map( param => 'req.params.'+ param.getName() ).join(', ');
    wr.out(`res.json( service${cl.getName()}.${methodName}(${paramsList}) );`, true)
  wr.indent(-1)
  wr.out(`})`, true)

  // generate swagger docs of this endpoin, a simple version so far
  const state = wr.getState().swagger
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
  }  
  return wr;
}

// write axios client endpoint for method
export const WriteClientEndpoint = (wr:R.CodeWriter, p:Project, cl:ClassDeclaration, m:MethodDeclaration ) : R.CodeWriter => {

  const methodName = m.getName()

  // get function valid parameters...
  const validParams = m.getParameters().filter( p => {
    const t = p.getType()
    if(t.compilerType.symbol) {
      return false
    }  
    return true
  });

  // method signature
  const signatureStr = validParams.map( p => {
    const t = p.getType()
    let typename = t.getText()
    if(t.compilerType.symbol) {
      typename = t.compilerType.symbol.escapedName + ''
    }  
    return p.getName() + `: ` + typename
  }).join(', ')

  // setting the body / post varas is not as simple...
  const axiosGetVars = validParams.map( p => {
    const t = p.getType()
    let typename = t.getText()
    if(t.compilerType.symbol) {
      typename = t.compilerType.symbol.escapedName + ''
    }  
    return '${' + p.getName() + '}'
  }).join('/')  

  wr.out(`// Service endpoint for ${methodName}`, true);
  wr.out(`async ${methodName}(${signatureStr}) : Promise<${utils.getMethodReturnTypeName(p.getTypeChecker(), m)}> {`, true)
    wr.indent(1)
    wr.out('return (await axios.get(`/v1/' + methodName + '/'+ axiosGetVars+ '`)).data;', true)
    wr.indent(-1)
  wr.out(`}`, true)

  return wr;
}
