
import {
  Service,
  url, 
  ErrorCode,
  Body
} from './decorators'

import { SomeReturnValue, myTemplate, int, TestUser, Device, InvalidIDError, CreateDevice, CreateUser } from './models/model'

/** 
 * APIn kuvaus jne.
 * 
 * @title JeeJee
 * @service  
 * @endpoint /v1/
 * 
 */
export class ServerInterface {

  /**
   * 
   * @alias user
   * @method put
   * @param id set user to some value
   * @param user 
   */
  putUser(id:string, user:TestUser) : TestUser {
    const u = new TestUser()
    u.name = user.name
    return u
  }

  /**
   * List all devices in the system
   * @param {string} id here could be the documentation of the ID value
   */
  getDevices(id:string) : Device[] {
    return [
      {id:1, name:'MacBook Pro'},
      {id:2, name:'iPhone'},
      {id:3, name:'Huawei'},
    ]
  }  
  
  allUsers() : TestUser[] {
    return [
      {name:'First User'},
      {name:'Second User'},
    ]
  }
  /**
   * Fetch all users
   * @param id of course the user id
   */
  users(id:string) : TestUser[] {
    return [
      {name:'First User'},
      {name:'Second User'},
    ]
  }

  createUser( u: CreateUser) : number {
    return 100
  }

  /**
   * Will set the device data
   * @description ok, looks good
   */
  setDeviceData( createNewDevice:CreateDevice) : SomeReturnValue {
    const value = new SomeReturnValue()
    value.response = createNewDevice.description + ' OK '
    return value
  }

  obj(v:number) : SomeReturnValue {

    // Test inserting function code inside some file
    function compilerInsertTest()  {
        for( let i=0; i< 10; i++) {
            console.log(i);
        }
        return 1450;
    }    
    // Then the client can use that computer generated code...
    const value = new SomeReturnValue()
    value.myValue = compilerInsertTest()
    return value
  }

  test2(id:number) : SomeReturnValue | InvalidIDError {
    if(id > 12) {
      const err = new InvalidIDError()
      err.message = `Invalid id ${id}`
      return err
    }
    const value = new SomeReturnValue()
    value.myValue = 12345
    return value
  }  

  HelloWorld(name:string) : string {
    return `Hello World ${name}`
  }

  hello(name:string) : string {
    return `Hello ${name}!!!`
  }  
}

