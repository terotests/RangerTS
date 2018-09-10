const express = require('express')
const app = express()

import {Robot} from './decorators'


// generated routes for the app 
import {ServerInterface} from './api';
const serviceServerInterface = new ServerInterface();

// these are written automatically
function automaticServices(app:any) {

  // Service endpoint for getAllDevices2
  app.get('/v1/getAllDevices2/:id', function( req, res ) {
    res.json( serviceServerInterface.getAllDevices2(req.params.id) );
  })

  // Service endpoint for users
  app.get('/v1/users/:id', function( req, res ) {
    res.json( serviceServerInterface.users(req.params.id) );
  })

  // Service endpoint for jee
  app.get('/v1/jee/:x/:y/:ss/:z/:requestBody', function( req, res ) {
    res.json( serviceServerInterface.jee(req.params.x, req.params.y, req.params.ss, req.params.z, req.params.requestBody) );
  })

  // Service endpoint for obj
  app.get('/v1/obj/:v', function( req, res ) {
    res.json( serviceServerInterface.obj(req.params.v) );
  })

  // Service endpoint for HelloWorld
  app.get('/v1/HelloWorld/:name', function( req, res ) {
    res.json( serviceServerInterface.HelloWorld(req.params.name) );
  })
}
automaticServices( app )


if (!module.parent) {
  app.listen(1337);
  console.log('listening on port 1337');
}  
  
