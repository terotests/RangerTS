import { SomeReturnValue, TestUser, Device, InvalidIDError, CreateDevice, CreateUser } from './models/model';
/**
 * APIn kuvaus jne.
 *
 * @title JeeJee
 * @service
 * @endpoint /v1/
 *
 */
export declare class ServerInterface {
    /**
     *
     * @alias user
     * @method put
     * @param id set user to some value
     * @param user
     */
    putUser(id: string, user: TestUser): TestUser;
    /**
     * List all devices in the system
     * @param {string} id here could be the documentation of the ID value
     */
    getDevices(id: string): Device[];
    allUsers(): TestUser[];
    /**
     * Fetch all users
     * @param id of course the user id
     */
    users(id: string): TestUser[];
    createUser(u: CreateUser): number;
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
