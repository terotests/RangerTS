"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../src/index");
var chai_1 = require("chai");
describe('Hello function', function () {
    it('should return hello world', function () {
        chai_1.expect(index_1.HelloWorld()).to.equal('Hello World!');
    });
});
//# sourceMappingURL=test_base.js.map