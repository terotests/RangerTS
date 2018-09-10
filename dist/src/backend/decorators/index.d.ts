export declare function url(s: string): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare function Robot(s: string): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare function ErrorCode(value: number): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare function TestFor(value: string): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare function Body(target?: Object, propertyKey?: string | symbol, parameterIndex?: number): void;
export declare function Service(name: string): (ctor: Function) => void;
