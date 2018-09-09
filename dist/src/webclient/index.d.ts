export declare class ClientInterface {
    jee(y: number, ss: string, requestBody: string): Promise<any>;
    obj(v: number): Promise<any>;
    HelloWorld(name: string): Promise<any>;
    getAllDevices(id: string): Promise<any>;
    users(id: string): Promise<any>;
}
