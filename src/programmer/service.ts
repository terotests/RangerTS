import * as R from 'robowr'
import { MethodDeclaration, ClassDeclaration, Project } from 'ts-simple-ast'
import * as utils from '../utils'

const getTypeName = utils.getTypeName
const isSimpleType = utils.isSimpleType
const getTypePath = utils.getTypePath

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
    "definitions" : {

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
export const WriteEndpoint = (wr:R.CodeWriter, p:Project, cl:ClassDeclaration, m:MethodDeclaration ) : R.CodeWriter => {

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
  
  const rArr = getTypePath( m.getReturnType() )
  const is_array = rArr[0] === 'Array'
  const rType = rArr.pop()  
  const successResponse = {}
  const definitions = {}

  p.getSourceFiles().forEach( s => {
    s.getClasses().forEach( cl => {
      if( cl.getName() === rType ) {
        console.log('END returns class ', cl.getName(), is_array)

        // create datatype
        definitions[cl.getName()] = {
          type : 'object',
          properties : {
            ...cl.getProperties().reduce( (prev, curr) => {
              return { ...prev,
                [curr.getName()] : {
                  'type' : getTypeName( curr.getType() )
                }
              }
            },{})
          }
        }
        if(is_array) {
          successResponse['200'] = {
            description : '',
            schema : {
              type: 'array',
              items : '#/definitions/' + cl.getName()
            }
          }
        }
      }
    })
  })

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
  const state = wr.getState().swagger
  const validParams = m.getParameters().filter( p => isSimpleType(p.getType()) )
  const axiosGetVars = validParams.map( p => ('{' + p.getName() + '}' ) ).join('/')  
  const paramList = 
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
      "parameters" : validParams.map( (p) => {
        return {
          name : p.getName(),
          in : "path",
          description : '',
          required : true,
          type : getTypeName( p.getType() )
        }
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
              "$ref": "#/definitions/"+rType
            }
          }
        }
      }
    }
  }  
  state.definitions = Object.assign( state.definitions, definitions )
  return wr;
}

// write axios client endpoint for method
export const WriteClientEndpoint = (wr:R.CodeWriter, p:Project, cl:ClassDeclaration, m:MethodDeclaration ) : R.CodeWriter => {

  const methodName = m.getName()
  // only simple parameters
  const validParams = m.getParameters().filter( p => isSimpleType(p.getType()) )
  // method signature
  const signatureStr = validParams.map( p => {
    return p.getName() + `: ` + getTypeName( p.getType()) 
  }).join(', ')

  // setting the body / post varas is not as simple...
  const axiosGetVars = validParams.map( p => ('${' + p.getName() + '}' ) ).join('/') 

  wr.out(`// Service endpoint for ${methodName}`, true);
  wr.out(`async ${methodName}(${signatureStr}) : Promise<${utils.getMethodReturnTypeName(p.getTypeChecker(), m)}> {`, true)
    wr.indent(1)
    wr.out('return (await axios.get(`/v1/' + methodName + '/'+ axiosGetVars+ '`)).data;', true)
    wr.indent(-1)
  wr.out(`}`, true)

  return wr;
}
