
import {
  Service,
  url, 
  ErrorCode,
  Body
} from './decorators'

import { SomeReturnValue, myTemplate, int, TestUser, Device, InvalidIDError } from './models/model'

@Service('foobar')
export class ServerInterface {

  getAllDevices2(id:string) : Device[] {
    return [
      {id:1, name:'MacBook Pro'},
      {id:2, name:'iPhone'},
      {id:3, name:'Huawei'},
    ]
  }  
  
  users(id:string) : TestUser[] {
    return [
      {name:'First User'},
      {name:'Second User'},
    ]
  }

  // Interace declaration with given parameters
  @url('/my/')
  @ErrorCode(404)
  jee(x:int, 
      y:number, 
      ss:string, 
      z:myTemplate<int>, 
      @Body requestBody:string) : SomeReturnValue {
    const value = new SomeReturnValue()
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

