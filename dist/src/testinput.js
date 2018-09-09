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
// the decorator for the url
function url(s) {
    return function (target, propertyKey, descriptor) {
        console.log("f(): called");
    };
}
function ErrorCode(value) {
    return function (target, propertyKey, descriptor) {
        console.log("ErrorCode called");
    };
}
function TestFor(value) {
    return function (target, propertyKey, descriptor) {
        console.log("TestFor called");
    };
}
function Body(target, propertyKey, parameterIndex) {
    /*
    let existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
    existingRequiredParameters.push(parameterIndex);
    Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
    */
}
function Service(name) {
    return function (ctor) {
        console.log("Plugin found: " + name);
    };
}
var SomeReturnValue = /** @class */ (function () {
    function SomeReturnValue() {
        this.myValue = 100;
    }
    return SomeReturnValue;
}());
exports.SomeReturnValue = SomeReturnValue;
var myTemplate = /** @class */ (function () {
    function myTemplate() {
    }
    return myTemplate;
}());
exports.myTemplate = myTemplate;
var int = /** @class */ (function () {
    function int() {
    }
    return int;
}());
exports.int = int;
var TestUser = /** @class */ (function () {
    function TestUser() {
    }
    return TestUser;
}());
exports.TestUser = TestUser;
var ServerInterface = /** @class */ (function () {
    function ServerInterface() {
    }
    // Interace declaration with given parameters
    ServerInterface.prototype.jee = function (x, y, ss, z, requestBody) {
        var value = new SomeReturnValue();
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
        var value = new SomeReturnValue();
        value.myValue = compilerInsertTest();
        return value;
    };
    ServerInterface.prototype.HelloWorld = function (name) {
        return "Hello World " + name;
    };
    ServerInterface.prototype.getAllDevices = function (id) {
        return [
            { name: 'MacBook Pro' },
            { name: 'iPhone' },
            { name: 'Huawei' },
        ];
    };
    ServerInterface.prototype.users = function (id) {
        return [
            { name: 'First User' },
            { name: 'Second User' },
        ];
    };
    __decorate([
        url('/my/'),
        ErrorCode(404),
        __param(4, Body),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [int, Number, String, myTemplate, String]),
        __metadata("design:returntype", SomeReturnValue)
    ], ServerInterface.prototype, "jee", null);
    ServerInterface = __decorate([
        Service('foobar')
    ], ServerInterface);
    return ServerInterface;
}());
exports.ServerInterface = ServerInterface;
function foobar(a) {
    var n = [];
    var ok = false;
    if (a == 1) {
        return true;
    }
    // There seems to be a typing error here ...
    if (a === 3)
        return true;
    return false;
}
/*
import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

    @OneToOne(type => UserMetadata, photoMetadata => photoMetadata.user)
    metadata: UserMetadata;
    
}

import {OneToOne, JoinColumn} from "typeorm";
import { HelloWorld } from "./index";

@Entity()
export class UserMetadata {

    @OneToOne(type => User, user => user.metadata)
    @JoinColumn()
    user: User;
}
*/ 
//# sourceMappingURL=testinput.js.map