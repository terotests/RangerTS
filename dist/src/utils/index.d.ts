import { TypeChecker, MethodDeclaration } from "ts-simple-ast";
export declare const getTypeName: (cType: any) => string;
export declare const getMethodReturnTypeName: (checker: TypeChecker, m: MethodDeclaration) => string;
