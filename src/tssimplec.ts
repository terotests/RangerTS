import * as ts from "typescript";
import Project, { ArrowFunction } from "ts-simple-ast";
import { MethodDeclaration, FunctionDeclaration } from 'ts-simple-ast'

import * as Ranger from 'ranger-compiler'
import * as R from 'robowr'
import { FunctionLikeDeclaration } from "typescript";

import * as ProgrammerBase from './programmer/service'

// Using Vesper
// http://vesper-framework.com/#/typescript/getting-started

// see
// https://github.com/dsherret/ts-simple-ast/issues/149


// initialize
const project = new Project();

const fileNames = process.argv.slice(2);

for( let file of fileNames) {
  project.addExistingSourceFileIfExists(file)
}

const sourceFile = project.getSourceFileOrThrow('src/testinput.ts');
let collectTests:MethodDeclaration[] = []

// there is example
const RFs = new R.CodeFileSystem()
const webservice = RFs.getFile('/src/webservice/', 'index.ts').getWriter()
const webclient = RFs.getFile('/src/webclient/', 'index.ts').getWriter()

// the service writer component...
const serviceWriter = ProgrammerBase.CreateServiceBase( webservice )
const clientWriter = ProgrammerBase.CreateClientBase( webclient )
const importWriter = serviceWriter.tag('imports')

// see
// https://github.com/dsherret/code-block-writer

// Example of how to insert code into existing files using the code writer...
function rewriteFunctions( list:FunctionDeclaration[] ) {
  list.forEach( fn => {
    if(fn.getName() === 'compilerInsertTest') {
      console.log('--> Found the function ....')
      fn.setBodyText(writer => {
        writer.write('for( let i=0; i< 10; i++)').block( ()=>{
          writer.writeLine('console.log(i);');
        })
        writer.write('return 1450;')
      })
    }
  })
}

sourceFile.getClasses().forEach( c=>{


  
  let is_service = false
  const className = c.getName();
  console.log('---- Class ', c.getName(), '-----')
  c.getTypeParameters().forEach( typeParam => {
    console.log( 'Parameter', typeParam.getType().getText() )
    // console.log(typeParam)
  })
  c.getDecorators().forEach( dec => {
    console.log('Class Decorator', dec.getFullName());
    is_service = (dec.getFullName() === 'Service');

    dec.getArguments().forEach( arg => {
      if( arg.getType().compilerType.flags & ts.TypeFlags.StringLiteral ) {
        console.log(' String literal argument ', arg.getFullText())
      }
      
    })  
  })

  if(is_service) {
    importWriter.out(`import {${className}} from '../testinput';`, true)
    serviceWriter.out(`const service${className} = new ${className}();`, true)
  }

  c.getProperties().forEach( m => {
    console.log('** member: ',m.getName())
    m.getDecorators().forEach( dec => {
      console.log('Member Decorator', dec.getFullName())

      // check arrow function return types etc.
      dec.getArguments().forEach( arg => {
        /*
        if( arg.getType().compilerType.flags & ts.TypeFlags. ) {
          console.log(' String literal argument ', arg.getFullText())
        }
        */
        if( arg.compilerNode.kind == ts.SyntaxKind.ArrowFunction ) {
          console.log('--> Arrow function')
          const arrowF = arg as ArrowFunction
          const returnType = arrowF.getReturnType().compilerType

          if(returnType.symbol) {
            console.log('Returns Class ', returnType.symbol.escapedName)
          }            
          // console.log(returnType.
          // console.log(arrowF.getReturnType())
        }

        if( arg.getType().compilerType.flags & ts.TypeFlags.StringLiteral ) {
          console.log(' String literal argument ', arg.getFullText())
        }
        if( arg.getType().compilerType.flags & ts.TypeFlags.NumberLiteral ) {
          console.log(' Number literal argument ', arg.getFullText())
        }       
      })      
    })
  })  
  c.getMethods().forEach( m => {


    const methodName = m.getName()
    console.log(m.getName())

    // for all methods inside the function...
    rewriteFunctions( m.getFunctions() )

    // we should be creating a service endpoint for the method
    if(is_service) {
      ProgrammerBase.WriteEndpoint( serviceWriter, c, m )
      ProgrammerBase.WriteClientEndpoint( clientWriter, c, m )
    }

    m.getDecorators().forEach( dec => {
      console.log('Decorator', dec.getFullName())
      
      // save the test 
      if(dec.getFullName()=='TestFor') {
        collectTests.push( m )
      }

      dec.getArguments().forEach( arg => {
        if( arg.getType().compilerType.flags & ts.TypeFlags.StringLiteral ) {
          console.log(' String literal argument ', arg.getFullText())
        }
        if( arg.getType().compilerType.flags & ts.TypeFlags.NumberLiteral ) {
          console.log(' Number literal argument ', arg.getFullText())
        }       
      })
    })    



    m.getParameters().forEach( p=> {
      console.log(' - ', p.getName())

      const t = p.getTypeNode()
      console.log( t.getKindName() )
      const checker = project.getTypeChecker()

      const tp = t.getType().compilerType
      if(tp.flags & ts.TypeFlags.Number) {
        console.log('Number type')
      }            
      if(tp.flags & ts.TypeFlags.String) {
        console.log('String type')
      }            
      if(tp.symbol) {
        console.log('Class ', tp.symbol.escapedName)
      }  
      p.getDecorators().forEach( dec => {
        console.log('Param Decorator', dec.getFullName())
        dec.getArguments().forEach( arg => {
          if( arg.getType().compilerType.flags & ts.TypeFlags.StringLiteral ) {
            console.log(' String literal argument ', arg.getFullText())
          }
        })
      })      
      // console.log( t.getType().compilerType.

    })
  })
})

// Ranger compiler code writer


async function foo () {
  console.log('---> Writing files')
  await RFs.saveTo('./', false );
  console.log('---> should have written')
}

foo()

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
project.save()

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