const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use( bodyParser.json() ); 

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../swagger.json');
 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

import {Robot} from './decorators'


// generated routes for the app 
import {ServerInterface} from './api';
const serviceServerInterface = new ServerInterface();

// these are written automatically
function automaticServices(app:any) {
  // Service endpoint for getDevices
  app.get('/v1/getDevices/:id', function( req, res ) {
    res.json( serviceServerInterface.getDevices(req.params.id) );
  })
  // Service endpoint for allUsers
  app.get('/v1/allUsers/', function( req, res ) {
    res.json( serviceServerInterface.allUsers() );
  })
  // Service endpoint for users
  app.get('/v1/users/:id', function( req, res ) {
    res.json( serviceServerInterface.users(req.params.id) );
  })
  // Service endpoint for setDeviceData
  app.post('/v1/setDeviceData/', function( req, res ) {
    res.json( serviceServerInterface.setDeviceData(req.body) );
  })
  // Service endpoint for obj
  app.get('/v1/obj/:v', function( req, res ) {
    res.json( serviceServerInterface.obj(req.params.v) );
  })
  // Service endpoint for test2
  app.get('/v1/test2/:id', function( req, res ) {
    res.json( serviceServerInterface.test2(req.params.id) );
  })
  // Service endpoint for HelloWorld
  app.get('/v1/HelloWorld/:name', function( req, res ) {
    res.json( serviceServerInterface.HelloWorld(req.params.name) );
  })
  // Service endpoint for hello
  app.get('/v1/hello/:name', function( req, res ) {
    res.json( serviceServerInterface.hello(req.params.name) );
  })
}
automaticServices( app )


if (!module.parent) {
  app.listen(1337);
  console.log('listening on port 1337');
}  
  
