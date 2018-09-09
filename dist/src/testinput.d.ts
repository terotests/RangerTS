export declare class SomeReturnValue {
    myValue: number;
}
export declare class myTemplate<T> {
    myValue: T;
}
export declare class int {
}
export declare class TestUser {
    name: string;
}
export declare class ServerInterface {
    jee(x: int, y: number, ss: string, z: myTemplate<int>, requestBody: string): SomeReturnValue;
    obj(v: number): SomeReturnValue;
    HelloWorld(name: string): string;
    getAllDevices(id: string): any[];
    users(id: string): TestUser[];
}
