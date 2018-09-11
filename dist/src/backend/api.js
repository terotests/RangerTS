"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var model_1 = require("./models/model");
/**
 * APIn kuvaus jne.
 *
 * @title JeeJee
 * @service
 * @endpoint /v1/
 *
 */
var ServerInterface = /** @class */ (function () {
    function ServerInterface() {
    }
    /**
     *
     * @alias user
     * @method put
     * @param id set user to some value
     * @param user
     */
    ServerInterface.prototype.putUser = function (id, user) {
        var u = new model_1.TestUser();
        u.name = user.name;
        return u;
    };
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
    /**
     * Fetch all users
     * @param id of course the user id
     */
    ServerInterface.prototype.users = function (id) {
        return [
            { name: 'First User' },
            { name: 'Second User' },
        ];
    };
    ServerInterface.prototype.createUser = function (u) {
        return 100;
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
    return ServerInterface;
}());
exports.ServerInterface = ServerInterface;
//# sourceMappingURL=api.js.map