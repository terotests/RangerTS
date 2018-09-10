import { SomeReturnValue, myTemplate, int, TestUser, Device } from './models/model';
export declare class ServerInterface {
    getAllDevices2(id: string): Device[];
    users(id: string): TestUser[];
    jee(x: int, y: number, ss: string, z: myTemplate<int>, requestBody: string): SomeReturnValue;
    obj(v: number): SomeReturnValue;
    HelloWorld(name: string): string;
}
