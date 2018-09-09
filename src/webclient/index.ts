
import axios from 'axios';



// generated routes for the app 
export class ClientInterface { 
  // Service endpoint for jee
  async jee(y: number, ss: string, requestBody: string) : Promise<any> {
    return await axios.get(`/v1/jee/${y}/${ss}/${requestBody}`);
  }
  // Service endpoint for obj
  async obj(v: number) : Promise<any> {
    return await axios.get(`/v1/obj/${v}`);
  }
  // Service endpoint for HelloWorld
  async HelloWorld(name: string) : Promise<any> {
    return await axios.get(`/v1/HelloWorld/${name}`);
  }
  // Service endpoint for getAllDevices
  async getAllDevices(id: string) : Promise<any> {
    return await axios.get(`/v1/getAllDevices/${id}`);
  }
  // Service endpoint for users
  async users(id: string) : Promise<any> {
    return await axios.get(`/v1/users/${id}`);
  }
}
