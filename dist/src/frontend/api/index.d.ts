import { SomeReturnValue, TestUser, Device, InvalidIDError } from '../../backend/models/model';
export declare class ClientInterface {
    getDevices(id: string): Promise<Array<Device>>;
    users(id: string): Promise<Array<TestUser>>;
    jee(y: number, ss: string, requestBody: string): Promise<SomeReturnValue>;
    obj(v: number): Promise<SomeReturnValue>;
    test2(id: number): Promise<SomeReturnValue | InvalidIDError>;
    HelloWorld(name: string): Promise<string>;
    hello(name: string): Promise<string>;
}
