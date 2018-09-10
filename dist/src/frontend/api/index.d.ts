import { SomeReturnValue, TestUser, Device } from '../../backend/models/model';
export declare class ClientInterface {
    getAllDevices2(id: string): Promise<Array<Device>>;
    users(id: string): Promise<Array<TestUser>>;
    jee(y: number, ss: string, requestBody: string): Promise<SomeReturnValue>;
    obj(v: number): Promise<SomeReturnValue>;
    HelloWorld(name: string): Promise<string>;
}
