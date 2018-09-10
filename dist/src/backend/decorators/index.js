"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// the decorator for the url
function url(s) {
    return function (target, propertyKey, descriptor) {
        console.log("f(): called");
    };
}
exports.url = url;
function Robot(s) {
    return function (target, propertyKey, descriptor) {
        console.log("f(): called");
    };
}
exports.Robot = Robot;
function ErrorCode(value) {
    return function (target, propertyKey, descriptor) {
        console.log("ErrorCode called");
    };
}
exports.ErrorCode = ErrorCode;
function TestFor(value) {
    return function (target, propertyKey, descriptor) {
        console.log("TestFor called");
    };
}
exports.TestFor = TestFor;
function Body(target, propertyKey, parameterIndex) {
    /*
    let existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
    existingRequiredParameters.push(parameterIndex);
    Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
    */
}
exports.Body = Body;
function Service(name) {
    return function (ctor) {
        console.log("Plugin found: " + name);
    };
}
exports.Service = Service;
//# sourceMappingURL=index.js.map