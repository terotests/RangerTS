import { TypeChecker, MethodDeclaration } from "ts-simple-ast";
export declare const isSimpleType: (cType: any) => boolean;
export declare const getTypePath: (cType: any, current?: string[]) => string[];
export declare const getTypeName: (cType: any) => string;
export declare const getMethodReturnTypeName: (checker: TypeChecker, m: MethodDeclaration) => string;
