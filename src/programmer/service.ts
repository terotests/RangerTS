import * as R from 'robowr'
import { MethodDeclaration, ClassDeclaration, Project } from 'ts-simple-ast'
import * as utils from '../utils'

const getTypeName = utils.getTypeName
const isSimpleType = utils.isSimpleType
const getTypePath = utils.getTypePath
const getSwaggerType = utils.getSwaggerType

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
const bodyParser = require('body-parser')
app.use( bodyParser.json() ); 
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
import {SomeReturnValue, TestUser, Device, InvalidIDError, CreateDevice } from '../../backend/models/model'
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

export const WriteEndpoint = (wr:R.CodeWriter, p:Project, cl:ClassDeclaration, m:MethodDeclaration ) : R.CodeWriter => {

  const methodName = m.getName()
  const is_post = m.getParameters().filter( p => !isSimpleType(p.getType()) ).length > 0
  const httpMethod = is_post ? 'post' : 'get';

  let methodDoc = '';
  const paramDocs = {}
  m.getJsDocs().forEach( doc => {
    if(doc.getComment()) {
      methodDoc = doc.getComment()
      console.log('COMMENT:', methodDoc)
    }
    doc.getTags().forEach( tag => {
      if(tag.getName() === 'param') {
        const cn:any = tag.compilerNode
        paramDocs[cn.name.escapedText] = tag.getComment()
      }      
    })
  })

  wr.out(`// Service endpoint for ${methodName}`, true);
  switch(httpMethod) {
    case 'get':
      wr.out(`app.get('/v1/${methodName}/${m.getParameters().map( param=> {
        return ':' + param.getName();
      }).join('/')}', function( req, res ) {`, true)
      wr.indent(1)
        const getParamsList = m.getParameters().map( param => 'req.params.'+ param.getName() ).join(', ');
        wr.out(`res.json( service${cl.getName()}.${methodName}(${getParamsList}) );`, true)
      wr.indent(-1)
      wr.out(`})`, true)
      break
    case 'post':
      wr.out(`app.post('/v1/${methodName}/', function( req, res ) {`, true)
      wr.indent(1)
        wr.out(`res.json( service${cl.getName()}.${methodName}(req.body) );`, true)
      wr.indent(-1)
      wr.out(`})`, true)
      break      
  }
  
  const rArr = getTypePath( m.getReturnType() )
  const is_array = rArr[0] === 'Array'
  const rType = rArr.pop()  
  const successResponse = {}
  const definitions = {}

  const createClassDef = (className:string) => {
    p.getSourceFiles().forEach( s => {
      s.getClasses().forEach( cl => {
        if( cl.getName() === className ) {
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
        }
      })
    })
  }

  successResponse['200'] = {
    description : '',
    schema : {
      ...getSwaggerType( rType, is_array )
    }
  }  
  createClassDef(rType) 
  // generate swagger docs of this endpoin, a simple version so far
  const state = wr.getState().swagger
  const validParams = m.getParameters(); // .filter( p => isSimpleType(p.getType()) )
  const axiosGetVars = httpMethod === 'get' ? validParams.map( p => ('{' + p.getName() + '}' ) ).join('/') : ''


  state.paths['/' + methodName + '/' + axiosGetVars] = {
    [httpMethod]: {
      "parameters" : validParams.map( (p) => {
        if(httpMethod==='post') {
          const rArr = getTypePath( p.getType() )
          const is_array = rArr[0] === 'Array'
          const rType = rArr.pop()  
          let tDef:any = {
            schema : {
              ...getSwaggerType( rType, is_array) 
            }
          }
          if( isSimpleType( p.getType()) ) {
            tDef = {
              type : rType
            }
          } else {
            createClassDef(rType)
          }                  
          return {
            name : p.getName(),
            in : "body",
            description : paramDocs[p.getName()] || '',
            required : true,
            ...tDef
          }
        }
        return {
          name : p.getName(),
          in : "path",
          description :  paramDocs[p.getName()] || '',
          required : true,
          type : getTypeName( p.getType() )
        }
      }),
      "description": methodDoc,
      "summary": methodDoc,
      "produces": [
        "application/json"
      ],
      "responses": {
        ...successResponse,
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
  const validParams = m.getParameters();
  const is_post = m.getParameters().filter( p => !isSimpleType(p.getType()) ).length > 0
  const httpMethod = is_post ? 'post' : 'get';
  // method signature
  const signatureStr = validParams.map( p => {
    return p.getName() + `: ` + getTypeName( p.getType()) 
  }).join(', ')
  const paramsStr = validParams.map( p => p.getName() ).join(', ')

  // setting the body / post varas is not as simple...
  const axiosGetVars = validParams.map( p => ('${' + p.getName() + '}' ) ).join('/') 

  switch(httpMethod) {
    case 'post':
      wr.out(`// Service endpoint for ${methodName}`, true);
      wr.out(`async ${methodName}(${signatureStr}) : Promise<${getTypeName(m.getReturnType())}> {`, true)
        wr.indent(1)
        if(is_post) wr.out('// should be posted', true)
        wr.out('return (await axios.post(`/v1/' + methodName + '/`,'+paramsStr+')).data;', true)
        wr.indent(-1)
      wr.out(`}`, true) 
      break; 
    case 'get':
    wr.out(`// Service endpoint for ${methodName}`, true);
    wr.out(`async ${methodName}(${signatureStr}) : Promise<${getTypeName(m.getReturnType())}> {`, true)
      wr.indent(1)
      if(is_post) wr.out('// should be posted', true)
      wr.out('return (await axios.get(`/v1/' + methodName + '/'+ axiosGetVars+ '`)).data;', true)
      wr.indent(-1)
    wr.out(`}`, true)  
  }
  return wr;
}
