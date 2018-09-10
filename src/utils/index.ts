import * as ts from 'typescript'
import { TypeChecker, SourceFile, Project, FunctionDeclaration, ArrowFunction, MethodDeclaration } from "ts-simple-ast";

// Interface method signatures

export const isSimpleType = function(cType:any) : boolean {
  const tp = cType.compilerType
  if(tp.flags & ts.TypeFlags.Number) {
    return true
  }            
  if(tp.flags & ts.TypeFlags.String) {
    return true
  }            
  return false
}

export const getTypePath = function(cType:any, current:string[] = []) : string[] {
  const tp = cType.compilerType
  if(tp.flags & ts.TypeFlags.Number) {
    return ['number']
  }            
  if(tp.flags & ts.TypeFlags.String) {
    return ['string']
  }            
  if(tp.symbol) {
    const res = [tp.symbol.escapedName]
    let end = []
    if(cType.getTypeArguments().length > 0 ) {
      cType.getTypeArguments().forEach( arg => {
        end = [...end, ...getTypePath(arg)]
      });
    }
    return [...res, ...end]
  }
  return ['any']  
}

export const getTypeName = function(cType:any) : string {
  const tp = cType.compilerType
  if(tp.flags & ts.TypeFlags.Number) {
    return 'number'
  }            
  if(tp.flags & ts.TypeFlags.String) {
    return 'string'
  }            
  if(tp.symbol) {
    let typeName = tp.symbol.escapedName + '';
    if(cType.getTypeArguments().length > 0 ) {
      typeName += '<' + cType.getTypeArguments().map( arg => {
        // console.log(arg)
        return getTypeName(arg)
      }) + '>';  
    }
    return typeName
  }
  return 'any'  
}

export const getMethodReturnTypeName = function(checker:TypeChecker, m:MethodDeclaration) : string {
  const cType = m.getReturnType()  
  const tp = cType.compilerType
  if(tp.flags & ts.TypeFlags.Number) {
    return 'number'
  }            
  if(tp.flags & ts.TypeFlags.String) {
    return 'string'
  }            
  if(tp.flags & ts.TypeFlags.Union) {
    console.log('-union type found')
    return cType.getUnionTypes().map( t => getTypeName(t) ).join('|')
  }            
  if(tp.symbol) {
    let typeName = tp.symbol.escapedName + '';
    if(cType.getTypeArguments().length > 0 ) {
      typeName += '<' + cType.getTypeArguments().map( arg => {
        // console.log(arg)
        return getTypeName(arg)
      }) + '>';  
    }
    return typeName
  }
  return 'any'  
}

/*
export const getTypeName = function(checker:TypeChecker, node:T ) {

  const tp = type.
  if(tp.flags & ts.TypeFlags.Number) {
    console.log('Number type')
  }            
  if(tp.flags & ts.TypeFlags.String) {
    console.log('String type')
  }            
  if(tp.symbol) {
    console.log('Class ', tp.symbol.escapedName)
  }   

}
*/



function walkClasses( project:Project, sourceFile:SourceFile ) {

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
  
      m.getDecorators().forEach( dec => {
        console.log('Decorator', dec.getFullName())
        
        // save the test 
        if(dec.getFullName()=='TestFor') {
          // collectTests.push( m )
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
}
