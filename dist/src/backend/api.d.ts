import { SomeReturnValue, TestUser, Device, InvalidIDError, CreateDevice } from './models/model';
export declare class ServerInterface {
    /**
     * List all devices in the system
     * @param {string} id here could be the documentation of the ID value
     */
    getDevices(id: string): Device[];
    allUsers(): TestUser[];
    users(id: string): TestUser[];
    /**
     * Will set the device data
     * @description ok, looks good
     */
    setDeviceData(createNewDevice: CreateDevice): SomeReturnValue;
    obj(v: number): SomeReturnValue;
    test2(id: number): SomeReturnValue | InvalidIDError;
    HelloWorld(name: string): string;
    hello(name: string): string;
}
