"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var ts_simple_ast_1 = require("ts-simple-ast");
var R = require("robowr");
var ProgrammerBase = require("./programmer/service");
// Using Vesper
// http://vesper-framework.com/#/typescript/getting-started
// see
// https://github.com/dsherret/ts-simple-ast/issues/149
// initialize
var project = new ts_simple_ast_1.default();
var fileNames = process.argv.slice(2);
for (var _i = 0, fileNames_1 = fileNames; _i < fileNames_1.length; _i++) {
    var file = fileNames_1[_i];
    project.addExistingSourceFileIfExists(file);
}
var sourceFile = project.getSourceFileOrThrow('src/testinput.ts');
var collectTests = [];
// there is example
var RFs = new R.CodeFileSystem();
var webservice = RFs.getFile('/src/webservice/', 'index.ts').getWriter();
var webclient = RFs.getFile('/src/webclient/', 'index.ts').getWriter();
// the service writer component...
var serviceWriter = ProgrammerBase.CreateServiceBase(webservice);
var clientWriter = ProgrammerBase.CreateClientBase(webclient);
var importWriter = serviceWriter.tag('imports');
// see
// https://github.com/dsherret/code-block-writer
function rewriteFunctions(list) {
    list.forEach(function (fn) {
        if (fn.getName() === 'compilerInsertTest') {
            console.log('--> Found the function ....');
            fn.setBodyText(function (writer) {
                writer.write('for( let i=0; i< 10; i++)').block(function () {
                    writer.writeLine('console.log(i);');
                });
                writer.write('return 1450;');
            });
        }
    });
}
sourceFile.getClasses().forEach(function (c) {
    var is_service = false;
    var className = c.getName();
    console.log('---- Class ', c.getName(), '-----');
    c.getTypeParameters().forEach(function (typeParam) {
        console.log('Parameter', typeParam.getType().getText());
        // console.log(typeParam)
    });
    c.getDecorators().forEach(function (dec) {
        console.log('Class Decorator', dec.getFullName());
        is_service = (dec.getFullName() === 'Service');
        dec.getArguments().forEach(function (arg) {
            if (arg.getType().compilerType.flags & ts.TypeFlags.StringLiteral) {
                console.log(' String literal argument ', arg.getFullText());
            }
        });
    });
    if (is_service) {
        importWriter.out("import {" + className + "} from '../testinput';", true);
        serviceWriter.out("const service" + className + " = new " + className + "();", true);
    }
    c.getProperties().forEach(function (m) {
        console.log('** member: ', m.getName());
        m.getDecorators().forEach(function (dec) {
            console.log('Member Decorator', dec.getFullName());
            // check arrow function return types etc.
            dec.getArguments().forEach(function (arg) {
                /*
                if( arg.getType().compilerType.flags & ts.TypeFlags. ) {
                  console.log(' String literal argument ', arg.getFullText())
                }
                */
                if (arg.compilerNode.kind == ts.SyntaxKind.ArrowFunction) {
                    console.log('--> Arrow function');
                    var arrowF = arg;
                    var returnType = arrowF.getReturnType().compilerType;
                    if (returnType.symbol) {
                        console.log('Returns Class ', returnType.symbol.escapedName);
                    }
                    // console.log(returnType.
                    // console.log(arrowF.getReturnType())
                }
                if (arg.getType().compilerType.flags & ts.TypeFlags.StringLiteral) {
                    console.log(' String literal argument ', arg.getFullText());
                }
                if (arg.getType().compilerType.flags & ts.TypeFlags.NumberLiteral) {
                    console.log(' Number literal argument ', arg.getFullText());
                }
            });
        });
    });
    c.getMethods().forEach(function (m) {
        var methodName = m.getName();
        console.log(m.getName());
        // for all methods inside the function...
        rewriteFunctions(m.getFunctions());
        // we should be creating a service endpoint for the method
        if (is_service) {
            ProgrammerBase.WriteEndpoint(serviceWriter, c, m);
            ProgrammerBase.WriteClientEndpoint(clientWriter, c, m);
        }
        m.getDecorators().forEach(function (dec) {
            console.log('Decorator', dec.getFullName());
            // save the test 
            if (dec.getFullName() == 'TestFor') {
                collectTests.push(m);
            }
            dec.getArguments().forEach(function (arg) {
                if (arg.getType().compilerType.flags & ts.TypeFlags.StringLiteral) {
                    console.log(' String literal argument ', arg.getFullText());
                }
                if (arg.getType().compilerType.flags & ts.TypeFlags.NumberLiteral) {
                    console.log(' Number literal argument ', arg.getFullText());
                }
            });
        });
        m.getParameters().forEach(function (p) {
            console.log(' - ', p.getName());
            var t = p.getTypeNode();
            console.log(t.getKindName());
            var checker = project.getTypeChecker();
            var tp = t.getType().compilerType;
            if (tp.flags & ts.TypeFlags.Number) {
                console.log('Number type');
            }
            if (tp.flags & ts.TypeFlags.String) {
                console.log('String type');
            }
            if (tp.symbol) {
                console.log('Class ', tp.symbol.escapedName);
            }
            p.getDecorators().forEach(function (dec) {
                console.log('Param Decorator', dec.getFullName());
                dec.getArguments().forEach(function (arg) {
                    if (arg.getType().compilerType.flags & ts.TypeFlags.StringLiteral) {
                        console.log(' String literal argument ', arg.getFullText());
                    }
                });
            });
            // console.log( t.getType().compilerType.
        });
    });
});
// Ranger compiler code writer
function foo() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('---> Writing files');
                    return [4 /*yield*/, RFs.saveTo('./', false)];
                case 1:
                    _a.sent();
                    console.log('---> should have written');
                    return [2 /*return*/];
            }
        });
    });
}
foo();
/*
const result = project.emitToMemory();
for (const file of result.getFiles()) {
  console.log("----");
  console.log(file.filePath);
  console.log("----");
  console.log(file.text);
  console.log("\n");
}
*/
project.save();
/*
functionDeclaration.setBodyText(writer => writer.writeLine("let myNumber = 5;")
    .write("if (myNumber === 5)").block(() => {
        writer.writeLine("console.log('yes')");
    }));
*/
/*
const myClassFile = project.createSourceFile("src/MyClass.ts", "export class MyClass {}");
const myEnumFile = project.createSourceFile("src/MyEnum.ts", {
    enums: [{
        name: "MyEnum",
        isExported: true,
        members: [{ name: "member" }]
    }]
});
*/
/*
// get information from ast
const myClass = myClassFile.getClassOrThrow("MyClass");
myClass.getName();          // returns: "MyClass"
myClass.hasExportKeyword(); // returns: true
myClass.isDefaultExport();  // returns: false

// manipulate ast
const myInterface = myClassFile.addInterface({
    name: "IMyInterface",
    isExported: true,
    properties: [{
        name: "myProp",
        type: "number"
    }]
});

myClass.rename("NewName");
myClass.addImplements(myInterface.getName());
myClass.addProperty({
    name: "myProp",
    initializer: "5"
});

project.getSourceFileOrThrow("src/ExistingFile.ts").delete();

// asynchronously save all the changes above
project.save();

// get underlying compiler node from the typescript AST from any node
const compilerNode = myClassFile.compilerNode;
*/ 
//# sourceMappingURL=tssimplec.js.map