"use strict";
exports.__esModule = true;
var ts = require("typescript");
var ts_simple_ast_1 = require("ts-simple-ast");
var R = require("ranger-compiler");
// Using Vesper
// http://vesper-framework.com/#/typescript/getting-started
var KoaServiceBase = function (wr) {
    wr.out("\n'use strict';\n//var compress = require('koa-compress');\n//var logger = require('koa-logger');\n//var serve = require('koa-static');\nconst route = require('koa-route');\nconst koa = require('koa');\nconst path = require('path');\nconst app = module.exports = koa();", true);
    wr.createTag('imports');
    wr.out('', true);
    wr.out('// generated routes for the app ', true);
    // write service code a this point..
    var fork = wr.fork();
    wr.raw("\nif (!module.parent) {\n  app.listen(1337);\n  console.log('listening on port 1337');\n}  \n  ", true);
    return fork;
};
// initialize
var project = new ts_simple_ast_1["default"]();
var fileNames = process.argv.slice(2);
for (var _i = 0, fileNames_1 = fileNames; _i < fileNames_1.length; _i++) {
    var file = fileNames_1[_i];
    project.addExistingSourceFileIfExists(file);
}
var sourceFile = project.getSourceFileOrThrow('src/testinput.ts');
var collectTests = [];
// there is example
var RFs = new R.CodeFileSystem();
var webservice = RFs.getFile('/src/webservice/', 'index.ts');
var serviceWriter = KoaServiceBase(webservice.getWriter());
var importWriter = serviceWriter.getTag('imports');
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
        // we should be creating a service endpoint for the method
        if (is_service) {
            // Generate the service endpoint
            serviceWriter.out("app.use(route.get('/v1/" + methodName + "/" + m.getParameters().map(function (param) {
                return ':' + param.getName();
            }).join('/') + "', service" + className + "." + methodName + "));", true);
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
RFs.saveTo('./', true);
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
