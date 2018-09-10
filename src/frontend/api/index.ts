
import axios from 'axios';
import {SomeReturnValue, TestUser, Device, InvalidIDError, CreateDevice } from '../../backend/models/model'


// generated routes for the app 
export class ClientInterface { 
  // Service endpoint for getDevices
  async getDevices(id: string) : Promise<Array<Device>> {
    return (await axios.get(`/v1/getDevices/${id}`)).data;
  }
  // Service endpoint for allUsers
  async allUsers() : Promise<Array<TestUser>> {
    return (await axios.get(`/v1/allUsers/`)).data;
  }
  // Service endpoint for users
  async users(id: string) : Promise<Array<TestUser>> {
    return (await axios.get(`/v1/users/${id}`)).data;
  }
  // Service endpoint for setDeviceData
  async setDeviceData(createNewDevice: CreateDevice) : Promise<SomeReturnValue> {
    // should be posted
    return (await axios.post(`/v1/setDeviceData/`,createNewDevice)).data;
  }
  // Service endpoint for obj
  async obj(v: number) : Promise<SomeReturnValue> {
    return (await axios.get(`/v1/obj/${v}`)).data;
  }
  // Service endpoint for test2
  async test2(id: number) : Promise<any> {
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
