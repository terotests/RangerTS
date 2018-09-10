
import axios from 'axios';
import {SomeReturnValue, TestUser, Device, InvalidIDError } from '../../backend/models/model'


// generated routes for the app 
export class ClientInterface { 
  // Service endpoint for getAllDevices2
  async getAllDevices2(id: string) : Promise<Array<Device>> {
    return (await axios.get(`/v1/getAllDevices2/${id}`)).data;
  }
  // Service endpoint for users
  async users(id: string) : Promise<Array<TestUser>> {
    return (await axios.get(`/v1/users/${id}`)).data;
  }
  // Service endpoint for jee
  async jee(y: number, ss: string, requestBody: string) : Promise<SomeReturnValue> {
    return (await axios.get(`/v1/jee/${y}/${ss}/${requestBody}`)).data;
  }
  // Service endpoint for obj
  async obj(v: number) : Promise<SomeReturnValue> {
    return (await axios.get(`/v1/obj/${v}`)).data;
  }
  // Service endpoint for test2
  async test2(id: number) : Promise<SomeReturnValue|InvalidIDError> {
    return (await axios.get(`/v1/test2/${id}`)).data;
  }
  // Service endpoint for HelloWorld
  async HelloWorld(name: string) : Promise<string> {
    return (await axios.get(`/v1/HelloWorld/${name}`)).data;
  }
  // Service endpoint for hello
  async hello(name: string) : Promise<string> {
    return (await axios.get(`/v1/hello/${name}`)).data;
  }
}
