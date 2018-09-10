import { SomeReturnValue, myTemplate, int, TestUser, Device, InvalidIDError } from './models/model';
export declare class ServerInterface {
    getAllDevices2(id: string): Device[];
    users(id: string): TestUser[];
    jee(x: int, y: number, ss: string, z: myTemplate<int>, requestBody: string): SomeReturnValue;
    obj(v: number): SomeReturnValue;
    test2(id: number): SomeReturnValue | InvalidIDError;
    HelloWorld(name: string): string;
    hello(name: string): string;
}
