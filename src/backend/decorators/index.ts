
// the decorator for the url
export function url(s:string) {
  return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
      console.log("f(): called");
  }
}

export function Robot(s:string) {
  return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
      console.log("f(): called");
  }
}

export function ErrorCode(value:number) {
  return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
      console.log("ErrorCode called");
  }
}

export function TestFor(value:string) {
  return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
      console.log("TestFor called");
  }
}

export function Body(target?: Object, propertyKey?: string | symbol, parameterIndex?: number) {
  /*
  let existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
  existingRequiredParameters.push(parameterIndex);
  Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
  */
}

export function Service(name: string) {
  return (ctor: Function) => {
      console.log("Plugin found: " + name);
  }
}