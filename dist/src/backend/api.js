"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var decorators_1 = require("./decorators");
var model_1 = require("./models/model");
var ServerInterface = /** @class */ (function () {
    function ServerInterface() {
    }
    /**
     * List all devices in the system
     * @param {string} id here could be the documentation of the ID value
     */
    ServerInterface.prototype.getDevices = function (id) {
        return [
            { id: 1, name: 'MacBook Pro' },
            { id: 2, name: 'iPhone' },
            { id: 3, name: 'Huawei' },
        ];
    };
    ServerInterface.prototype.allUsers = function () {
        return [
            { name: 'First User' },
            { name: 'Second User' },
        ];
    };
    ServerInterface.prototype.users = function (id) {
        return [
            { name: 'First User' },
            { name: 'Second User' },
        ];
    };
    /**
     * Will set the device data
     * @description ok, looks good
     */
    ServerInterface.prototype.setDeviceData = function (createNewDevice) {
        var value = new model_1.SomeReturnValue();
        value.response = createNewDevice.description + ' OK ';
        return value;
    };
    ServerInterface.prototype.obj = function (v) {
        // Test inserting function code inside some file
        function compilerInsertTest() {
            for (var i = 0; i < 10; i++) {
                console.log(i);
            }
            return 1450;
        }
        // Then the client can use that computer generated code...
        var value = new model_1.SomeReturnValue();
        value.myValue = compilerInsertTest();
        return value;
    };
    ServerInterface.prototype.test2 = function (id) {
        if (id > 12) {
            var err = new model_1.InvalidIDError();
            err.message = "Invalid id " + id;
            return err;
        }
        var value = new model_1.SomeReturnValue();
        value.myValue = 12345;
        return value;
    };
    ServerInterface.prototype.HelloWorld = function (name) {
        return "Hello World " + name;
    };
    ServerInterface.prototype.hello = function (name) {
        return "Hello " + name + "!!!";
    };
    ServerInterface = __decorate([
        decorators_1.Service('foobar')
    ], ServerInterface);
    return ServerInterface;
}());
exports.ServerInterface = ServerInterface;
//# sourceMappingURL=api.js.map