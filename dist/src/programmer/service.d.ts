import * as R from 'robowr';
import { MethodDeclaration, ClassDeclaration } from 'ts-simple-ast';
export declare const CreateServiceBase: (wr: R.CodeWriter, port?: number) => R.CodeWriter;
export declare const CreateClientBase: (wr: R.CodeWriter, port?: number) => R.CodeWriter;
export declare const WriteEndpoint: (wr: R.CodeWriter, cl: ClassDeclaration, m: MethodDeclaration) => R.CodeWriter;
export declare const WriteClientEndpoint: (wr: R.CodeWriter, cl: ClassDeclaration, m: MethodDeclaration) => R.CodeWriter;