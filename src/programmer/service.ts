import * as R from 'robowr'
import { MethodDeclaration, ClassDeclaration } from 'ts-simple-ast'

// write the service main file
export const CreateServiceBase = (wr:R.CodeWriter, port:number = 1337) : R.CodeWriter => {

  // use express
  wr.out(`
var express = require('express')
var app = express()
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

export const WriteEndpoint = (wr:R.CodeWriter, cl:ClassDeclaration, m:MethodDeclaration ) : R.CodeWriter => {

  const methodName = m.getName()

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
  return wr;
}

// write axios client endpoint for method
export const WriteClientEndpoint = (wr:R.CodeWriter, cl:ClassDeclaration, m:MethodDeclaration ) : R.CodeWriter => {

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
  wr.out(`async ${methodName}(${signatureStr}) : Promise<any> {`, true)
    wr.indent(1)
    wr.out('return await axios.get(`/v1/' + methodName + '/'+ axiosGetVars+ '`);', true)
    wr.indent(-1)
  wr.out(`}`, true)

  return wr;
}
