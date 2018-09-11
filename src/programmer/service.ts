import * as R from 'robowr'
import { MethodDeclaration, ClassDeclaration, Project } from 'ts-simple-ast'
import * as utils from '../utils'

const getTypeName = utils.getTypeName
const isSimpleType = utils.isSimpleType
const getTypePath = utils.getTypePath
const getSwaggerType = utils.getSwaggerType
const getMethodDoc = utils.getMethodDoc

export const initSwagger = (wr:R.CodeWriter) : R.CodeWriter => {

  const services = wr.getState().services
  const service = services[ Object.keys( services ).pop() ]
  const base = {  
    "swagger": "2.0",
    "basePath": service.endpoint || '/v1/', 
    "paths" : {

    },
    "definitions" : {

    },
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
import {
  CreateUser,
  SomeReturnValue, 
  TestUser, 
  Device, 
  InvalidIDError, 
  CreateDevice } from '../../backend/models/model'
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

export const WriteEndpoint = (wr:R.CodeWriter, project:Project, clName:ClassDeclaration, method:MethodDeclaration ) : R.CodeWriter => {

  let methodName = method.getName()
  const getParams = method.getParameters().filter( param => isSimpleType(param.getType()) )
  const postParams = method.getParameters().filter( param => !isSimpleType(param.getType()) )
  const is_post = method.getParameters().filter( project => !isSimpleType(project.getType()) ).length > 0
  let httpMethod = is_post ? 'post' : 'get';
  const getParamStr = getParams.map( param=> {
    return ':' + param.getName();
  }).join('/')

  const methodInfo = getMethodDoc(method)
  const getMethodAlias = () : string => {
    return methodInfo.params.alias || methodName
  } 
  const getHTTPMethod = () : string => {
    return methodInfo.params.method || httpMethod
  } 
  wr.out(`// Service endpoint for ${methodName}`, true);
  wr.out(`app.${getHTTPMethod()}('/v1/${getMethodAlias()}/${getParamStr}', function( req, res ) {`, true)
  wr.indent(1)
  const argParams = getParams.map( param => 'req.params.'+ param.getName() );
  const postArgs = postParams.length > 0 ? ['req.body'] : []
  const paramList = [...argParams, ...postArgs].join(',')
  wr.out(`res.json( service${clName.getName()}.${methodName}(${paramList}) );`, true)
  wr.indent(-1)
  wr.out(`})`, true)
  
  const rArr = getTypePath( method.getReturnType() )
  const is_array = rArr[0] === 'Array'
  const rType = rArr.pop()  
  const successResponse = {}
  const definitions = {}

  const createClassDef = (className:string) => {
    project.getSourceFiles().forEach( s => {
      s.getClasses().forEach( clName => {
        if( clName.getName() === className ) {
          definitions[clName.getName()] = {
            type : 'object',
            properties : {
              ...clName.getProperties().reduce( (prev, curr) => {
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
  const validParams = method.getParameters(); 
  const axiosGetVars = getParams.map( param => ('{' + param.getName() + '}' ) ).join('/')

  state.paths['/' + getMethodAlias() + '/' + axiosGetVars] = {
    [getHTTPMethod()]: {
      "parameters" : [
        ...getParams.map( (param) => {
          return {
            name : param.getName(),
            in : "path",
            description :  methodInfo.params[param.getName()] || '',
            required : true,
            type : getTypeName( param.getType() )
          }          
        }),
        ...postParams.map( (param) => {
          const rArr = getTypePath( param.getType() )
          const is_array = rArr[0] === 'Array'
          const rType = rArr.pop()  
          let tDef:any = {
            schema : {
              ...getSwaggerType( rType, is_array) 
            }
          }
          if( isSimpleType( param.getType()) ) {
            tDef = {
              type : rType
            }
          } else {
            createClassDef(rType)
          }                  
          return {
            name : param.getName(),
            in : "body",
            description : methodInfo.params[param.getName()] || '',
            required : true,
            ...tDef
          }
        })
      ],
      "description": methodInfo.params.description || methodInfo.comment,
      "summary": methodInfo.params.summary || methodInfo.params.description || methodInfo.comment,
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
export const WriteClientEndpoint = (wr:R.CodeWriter, project:Project, clName:ClassDeclaration, method:MethodDeclaration ) : R.CodeWriter => {

  let methodName = method.getName()
  // only simple parameters
  const validParams = method.getParameters();
  const getParams = method.getParameters().filter( param => isSimpleType(param.getType()) )  
  const postParams = method.getParameters().filter( param => !isSimpleType(param.getType()) )  
  const is_post = method.getParameters().filter( project => !isSimpleType(project.getType()) ).length > 0
  let httpMethod = is_post ? 'post' : 'get';
  // method signature
  const signatureStr = validParams.map( project => {
    return project.getName() + `: ` + getTypeName( project.getType()) 
  }).join(', ')
  const paramsStr = getParams.map( project => project.getName() ).join(', ')
  const postParamsStr = postParams.map( project => project.getName() ).join(', ')

  // setting the body / post varas is not as simple...
  const axiosGetVars = getParams.map( param => ('${' + param.getName() + '}' ) ).join('/') 
  const methodInfo = getMethodDoc(method)
  if(methodInfo.params.method) {
    httpMethod = methodInfo.params.method
  }
  if(methodInfo.params.alias) {
    methodName = methodInfo.params.alias
  }  
  switch(httpMethod) {
    case 'post':
      wr.out(`// Service endpoint for ${methodName}`, true);
      wr.out(`async ${methodName}(${signatureStr}) : Promise<${getTypeName(method.getReturnType())}> {`, true)
        wr.indent(1)
        if(is_post) wr.out('// should be posted', true)
        wr.out('return (await axios.post(`/v1/' + methodName + '/'+ axiosGetVars+ '`,'+postParamsStr+')).data;', true)
        wr.indent(-1)
      wr.out(`}`, true) 
      break; 
    case 'get':
      wr.out(`// Service endpoint for ${methodName}`, true);
      wr.out(`async ${methodName}(${signatureStr}) : Promise<${getTypeName(method.getReturnType())}> {`, true)
        wr.indent(1)
        if(is_post) wr.out('// should be posted', true)
        wr.out('return (await axios.get(`/v1/' + methodName + '/'+ axiosGetVars+ '`)).data;', true)
        wr.indent(-1)
      wr.out(`}`, true)  
      break;
    default:
      wr.out(`// Service endpoint for ${methodName}`, true);
      wr.out(`async ${methodName}(${signatureStr}) : Promise<${getTypeName(method.getReturnType())}> {`, true)
        wr.indent(1)
        if(is_post) wr.out('// should be posted', true)
        wr.out('return (await axios.'+httpMethod+'(`/v1/' + methodName + '/'+ axiosGetVars+ '`)).data;', true)
        wr.indent(-1)
      wr.out(`}`, true) 
  }
  return wr;
}
