import { readFileSync } from "fs";
import * as ts from "typescript";
import { VariableDeclaration, VariableStatement, VariableDeclarationList, MethodDeclaration, TypeReference, TypeNode, TypeReferenceNode, resolveTypeReferenceDirective } from "typescript";

// see
// https://github.com/Microsoft/TypeScript/blob/master/src/compiler/types.ts

// https://blog.scottlogic.com/2017/05/02/typescript-compiler-api-revisited.html
// https://dev.doctorevidence.com/how-to-write-a-typescript-transform-plugin-fc5308fdd943

// https://ts-ast-viewer.com/

// Flags
// https://github.com/Microsoft/TypeScript/blob/master/src/compiler/types.ts#L431

// other
// https://www.npmjs.com/package/swagger-ts-generator

// TSOA is using ts compiler too
// https://github.com/lukeautry/tsoa/blob/master/src/cli.ts

const fileNames = process.argv.slice(2);

console.log('files', fileNames)
const program = ts.createProgram(fileNames,  {
  target: ts.ScriptTarget.ES2015,
  module: ts.ModuleKind.CommonJS
});
const checker = program.getTypeChecker();

export function delint(sourceFile: ts.SourceFile) {
  delintNode(sourceFile);

  // HasType -> variable declaration
  function delintNode(node: ts.Node) {
    const start = node.getStart()
    // console.log( node.kind, '=>', sourceFile.getFullText().substring( start, node.end) )
    // console.log( start.toString() )
    // console.log(node.getStart())

    const showCode = (node:ts.Node, info:string) => {
      console.log(node.kind, info, sourceFile.getFullText().substring( node.getStart(), node.end))      
    }

    switch (node.kind) {

      case ts.SyntaxKind.Decorator:
        showCode(node, 'FOUND a decorator')
        break

      case ts.SyntaxKind.MethodDeclaration:
        showCode(node, 'FOUND a method')
        // console.log(node)
        const m = node as MethodDeclaration
        console.log('method type -> ', m.type.kind)

        const signature = checker.getSignatureFromDeclaration(m);
        const returnType = checker.getReturnTypeOfSignature(signature);
        const parameters = m.parameters; // array of Parameters
        // const docs = methodDeclaration.jsDoc; // array of js docs 

        console.log('--- params ---')
        for( let p of parameters) {
          console.log('parameter name ', p.name.getFullText());
          // console.log('parameter type', p.type)
          let tp = checker.getTypeFromTypeNode(p.type)
          if(tp.symbol) {
            console.log( 'type of the symbol: ', tp.symbol.escapedName )
            
          } else {
            // if( tp is ts.TypeO)
            if(tp.flags & ts.TypeFlags.Number) {
              console.log('Number type')
            }            
            if(tp.flags & ts.TypeFlags.String) {
              console.log('String type')
            }            
          }
          
        }
        
        // console.log(signature)
        // console.log('return type', returnType)
        if(returnType.isClassOrInterface()) {
          console.log('return type is class ')
        }
        // console.log(signature.getReturnType().getNumberIndexType())
        // returnType.getNumberIndexType()
        

        // const typelist = checker.getBaseTypes()

        // console.log(parameters)

        // signature.getReturnType()

        // ts.isClassDeclaration(node)
        // ts.isMethodDeclaration(node)

        //let tp = checker.getTypeFromTypeNode(m.type)
        //console.log(tp)



        // console.log( checker.getTypeAtLocation(m) )

        if( ts.SyntaxKind.TypeReference === m.type.kind ) {
          /*
          const tr = node as TypeNode
          console.log('Type reference ', m.type.getFullText())
          const trNode = m.type as TypeReferenceNode
          console.log('trNode', trNode)
          const t = checker.getTypeFromTypeNode(trNode)
          let tp = checker.getTypeFromTypeNode(m.type)
          console.log(checker.getFullyQualifiedName(tp.symbol))
          const symbol = checker.getSymbolAtLocation(trNode.typeName)
          console.log(t)
          */
          
          // const symbol = checker.getSymbolAtLocation(trNode.typeName) as ts.Symbol;
          // console.log('typename', trNode.typeName)
          // console.log('symbol', symbol)
/*
const anode = node as ts.TypeReferenceNode;
const type = this.typechecker.getTypeAtLocation(anode);
const symbol = type.symbol || type.aliasSymbol;
const decls = symbol.getDeclarations() as ts.Declaration[];
*/
        
          /*
          console.log('alias', tr.aliasSymbol)
          if(tr.isClassOrInterface()) {
            console.log('is class or interface')
          }
          // console.log(tr.isUnion)
          console.log('args', tr.typeArguments)
          */
        }

        break;
      
      case ts.SyntaxKind.ClassDeclaration:
        showCode(node, 'FOUND a class')
        break;
/*
    export interface VariableDeclaration extends NamedDeclaration {
        kind: SyntaxKind.VariableDeclaration;
        parent: VariableDeclarationList | CatchClause;
        name: BindingName;                    // Declared variable name
        exclamationToken?: ExclamationToken;  // Optional definite assignment assertion
        type?: TypeNode;                      // Optional type annotation
        initializer?: Expression;             // Optional initializer
    }
*/      
      case ts.SyntaxKind.VariableStatement:
      /*
        console.log(node.kind, 'VariableStatement...: ', sourceFile.getFullText().substring( start, node.end))
        // console.log(node)
        const vd = node as VariableStatement
        console.log( vd.getChildAt(0).kind )
        console.log(vd.kind, ' <= statement.kind')

        vd.declarationList.forEachChild( d => {
          console.log('declaration list item ')
          console.log( sourceFile.getFullText().substring( d.getStart(), d.end))
        })

        console.log(node)
        */

        /*if(vd.kind === ts.SyntaxKind.ConstKeyword) {

        }*/

        // delintNode( vd.initializer )
        // delint( )
        break;  
      case ts.SyntaxKind.VariableDeclarationList:  
        console.log(node.kind, 'VariableDeclarationList...: ', sourceFile.getFullText().substring( start, node.end))
        const list = node as VariableDeclarationList
        if(list.flags === ts.NodeFlags.Const) {
          console.log('CONST expression')
        }
        break
      case ts.SyntaxKind.VariableDeclaration:
        console.log(node.kind, 'VariableDeclaration...: ', sourceFile.getFullText().substring( start, node.end))
        const vd2 = node as VariableDeclaration
        console.log('VariableDeclaration.kind ', vd2.kind)
        if(vd2.initializer) console.log('initializer.kind ', vd2.initializer.kind)
        if(vd2.type) console.log('type.kind ', vd2.type.kind)
        // console.log('initializer ', vd2.)
        break;    
      case ts.SyntaxKind.ConstKeyword:
        console.log('Const Keyword was found')
        break;         
      case ts.SyntaxKind.ArrayType:
        let { line, character } = sourceFile.getLineAndCharacterOfPosition(
          node.getStart()
        );
        console.log('array type declaration at line ', line)      
      break;
      case ts.SyntaxKind.ForStatement:
      case ts.SyntaxKind.ForInStatement:
      case ts.SyntaxKind.WhileStatement:
      case ts.SyntaxKind.DoStatement:
        if ((<ts.IterationStatement>node).statement.kind !== ts.SyntaxKind.Block) {
          report(
            node,
            "A looping statement's contents should be wrapped in a block body."
          );
        }
        break;

      case ts.SyntaxKind.IfStatement:
        let ifStatement = <ts.IfStatement>node;
        if (ifStatement.thenStatement.kind !== ts.SyntaxKind.Block) {
          report(
            ifStatement.thenStatement,
            "An if statement's contents should be wrapped in a block body."
          );
        }
        if (
          ifStatement.elseStatement &&
          ifStatement.elseStatement.kind !== ts.SyntaxKind.Block &&
          ifStatement.elseStatement.kind !== ts.SyntaxKind.IfStatement
        ) {
          report(
            ifStatement.elseStatement,
            "An else statement's contents should be wrapped in a block body."
          );
        }
        break;

      case ts.SyntaxKind.BinaryExpression:
        let op = (<ts.BinaryExpression>node).operatorToken.kind;
        if (
          op === ts.SyntaxKind.EqualsEqualsToken ||
          op == ts.SyntaxKind.ExclamationEqualsToken
        ) {
          report(node, "Use '===' and '!=='.");
        }
        break;
    }

    ts.forEachChild(node, delintNode);
  }

  function report(node: ts.Node, message: string) {
    let { line, character } = sourceFile.getLineAndCharacterOfPosition(
      node.getStart()
    );
    console.log(
      `${sourceFile.fileName} (${line + 1},${character + 1}): ${message}`
    );
  }
}


fileNames.forEach(fileName => {
  // Parse a file


  
  let sourceFile = program.getSourceFile(fileName); /*ts.createSourceFile(
    fileName,
    readFileSync(fileName).toString(),
    ts.ScriptTarget.ES2015,
    true
  );*/
  
  delint(sourceFile);
});

/*
program.getSourceFiles().forEach(sourceFile => {
  if(sourceFile.isDeclarationFile) {
    delint(sourceFile);
  }
});
*/