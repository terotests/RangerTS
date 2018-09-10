"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var decorators_1 = require("./decorators");
var model_1 = require("./models/model");
var ServerInterface = /** @class */ (function () {
    function ServerInterface() {
    }
    ServerInterface.prototype.getAllDevices2 = function (id) {
        return [
            { id: 1, name: 'MacBook Pro' },
            { id: 2, name: 'iPhone' },
            { id: 3, name: 'Huawei' },
        ];
    };
    ServerInterface.prototype.users = function (id) {
        return [
            { name: 'First User' },
            { name: 'Second User' },
        ];
    };
    // Interace declaration with given parameters
    ServerInterface.prototype.jee = function (x, y, ss, z, requestBody) {
        var value = new model_1.SomeReturnValue();
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
    ServerInterface.prototype.HelloWorld = function (name) {
        return "Hello World " + name;
    };
    __decorate([
        decorators_1.url('/my/'),
        decorators_1.ErrorCode(404),
        __param(4, decorators_1.Body),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [model_1.int, Number, String, model_1.myTemplate, String]),
        __metadata("design:returntype", model_1.SomeReturnValue)
    ], ServerInterface.prototype, "jee", null);
    ServerInterface = __decorate([
        decorators_1.Service('foobar')
    ], ServerInterface);
    return ServerInterface;
}());
exports.ServerInterface = ServerInterface;
//# sourceMappingURL=api.js.map