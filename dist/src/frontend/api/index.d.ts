import { CreateUser, SomeReturnValue, TestUser, Device, CreateDevice } from '../../backend/models/model';
export declare class ClientInterface {
    user(id: string, user: TestUser): Promise<TestUser>;
    getDevices(id: string): Promise<Array<Device>>;
    allUsers(): Promise<Array<TestUser>>;
    users(id: string): Promise<Array<TestUser>>;
    createUser(u: CreateUser): Promise<number>;
    setDeviceData(createNewDevice: CreateDevice): Promise<SomeReturnValue>;
    obj(v: number): Promise<SomeReturnValue>;
    test2(id: number): Promise<any>;
    HelloWorld(name: string): Promise<string>;
    hello(name: string): Promise<string>;
}
