import * as R from 'robowr';
import { MethodDeclaration, ClassDeclaration, Project } from 'ts-simple-ast';
export declare const initSwagger: (wr: R.CodeWriter) => R.CodeWriter;
export declare const CreateServiceBase: (wr: R.CodeWriter, port?: number) => R.CodeWriter;
export declare const CreateClientBase: (wr: R.CodeWriter, port?: number) => R.CodeWriter;
export declare const WriteEndpoint: (wr: R.CodeWriter, project: Project, clName: ClassDeclaration, method: MethodDeclaration) => R.CodeWriter;
export declare const WriteClientEndpoint: (wr: R.CodeWriter, project: Project, clName: ClassDeclaration, method: MethodDeclaration) => R.CodeWriter;
