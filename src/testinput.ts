

// the decorator for the url
function url(s:string) {
  return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
      console.log("f(): called");
  }
}
function ErrorCode(value:number) {
  return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
      console.log("ErrorCode called");
  }
}
function TestFor(value:string) {
  return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
      console.log("TestFor called");
  }
}
function Body(target?: Object, propertyKey?: string | symbol, parameterIndex?: number) {
  /*
  let existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
  existingRequiredParameters.push(parameterIndex);
  Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
  */
}

function Service(name: string) {
  return (ctor: Function) => {
      console.log("Plugin found: " + name);
  }
}

export class SomeReturnValue {
  myValue = 100
}
export class myTemplate<T> {
  myValue:T
}

export class int {

}


export class TestUser {
  name:string
}

@Service('foobar')
export class ServerInterface {

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

  HelloWorld(name:string) : string {
    return `Hello World ${name}`
  }

  getAllDevices(id:string) : any[] {
    return [
      {name:'MacBook Pro'},
      {name:'iPhone'},
      {name:'Huawei'},
    ]
  }  
  
  users(id:string) : TestUser[] {
    return [
      {name:'First User'},
      {name:'Second User'},
    ]
  }
}

function foobar(a:number) : boolean {
  const n:string[] = []
  const ok = false
  if(a==1) {
    return true
  }
  // There seems to be a typing error here ...
  if(a===3) return true
  return false
}

/*
import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

    @OneToOne(type => UserMetadata, photoMetadata => photoMetadata.user)
    metadata: UserMetadata;
    
}

import {OneToOne, JoinColumn} from "typeorm";
import { HelloWorld } from "./index";

@Entity()
export class UserMetadata {

    @OneToOne(type => User, user => user.metadata)
    @JoinColumn()
    user: User;
}
*/