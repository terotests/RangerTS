import * as ts from "typescript";
import Project, { ArrowFunction } from "ts-simple-ast";
import { MethodDeclaration, FunctionDeclaration } from 'ts-simple-ast'
import * as R from 'robowr'
import { FunctionLikeDeclaration, Type } from "typescript";
import * as ProgrammerBase from './programmer/service'


async function create_project() {
  const project = new Project();
  // const fileNames = process.argv.slice(2);
  // manually add some files
  project.addExistingSourceFileIfExists('src/backend/index.ts');
  project.addExistingSourceFileIfExists('src/backend/api.ts');
  
  // see: https://dsherret.github.io/ts-simple-ast/setup/adding-source-files
  const sourceFile = project.getSourceFileOrThrow('src/backend/api.ts');
  const RFs = new R.CodeFileSystem()
  
  // const webservice = RFs.getFile('/src/backend/', 'index.ts').getWriter()
  const webclient = RFs.getFile('/src/frontend/api/', 'index.ts').getWriter()
  const clientWriter = ProgrammerBase.CreateClientBase( webclient )
  
  // inject code into existing codebase, which allows both humans and
  // automation work together!!
  const injectWriter = new R.CodeWriter()

  // initialize the Swagger to the code writer context
  ProgrammerBase.initSwagger( webclient )
  
  // find service declarations and create endpoints...
  sourceFile.getClasses().forEach( c=>{
    let is_service = false
    const className = c.getName();
    c.getDecorators().forEach( dec => {
      is_service = (dec.getFullName() === 'Service'); 
    })
    c.getMethods().forEach( m => {
      if(is_service) {
        // here we write the code using injection
        ProgrammerBase.WriteEndpoint( injectWriter, project, c, m )
        ProgrammerBase.WriteClientEndpoint( clientWriter, project, c, m )
      }
    })
  })

  // create swagger file
  const swagger = RFs.getFile('/src/swagger/', 'api.json').getWriter()
  swagger.raw( JSON.stringify( swagger.getState().swagger, null, 2 ) )
  
  // inject declaration to some function...
  const serviceFile = project.getSourceFileOrThrow('src/backend/index.ts');
  serviceFile.getFunction('automaticServices')
    .setBodyText(writer => {
        writer.setIndentationLevel('  ').write(injectWriter.getCode())
      })  
  await RFs.saveTo('./', false );
  await project.save()  
  console.log('Project saved')
}

create_project()
