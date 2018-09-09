"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// write the service main file
exports.CreateServiceBase = function (wr, port) {
    if (port === void 0) { port = 1337; }
    // use express
    wr.out("\nvar express = require('express')\nvar app = express()\n", true);
    wr.createTag('imports');
    wr.out('', true);
    wr.out('// generated routes for the app ', true);
    // write service code a this point..
    var fork = wr.fork();
    wr.raw("\nif (!module.parent) {\n  app.listen(" + port + ");\n  console.log('listening on port " + port + "');\n}  \n  ", true);
    return fork;
};
exports.CreateClientBase = function (wr, port) {
    if (port === void 0) { port = 1337; }
    wr.out("\nimport axios from 'axios';\n\n", true);
    wr.createTag('imports');
    wr.out('', true);
    wr.out('// generated routes for the app ', true);
    wr.out('export class ClientInterface { ', true);
    wr.indent(1);
    // write service code a this point..
    var fork = wr.fork();
    wr.indent(-1);
    wr.out('}', true);
    return fork;
};
exports.WriteEndpoint = function (wr, cl, m) {
    var methodName = m.getName();
    wr.out('', true);
    wr.out("// Service endpoint for " + methodName, true);
    wr.out("app.get('/v1/" + methodName + "/" + m.getParameters().map(function (param) {
        return ':' + param.getName();
    }).join('/') + "', function( req, res ) {", true);
    wr.indent(1);
    var paramsList = m.getParameters().map(function (param) { return 'req.params.' + param.getName(); }).join(', ');
    wr.out("res.json( service" + cl.getName() + "." + methodName + "(" + paramsList + ") );", true);
    wr.indent(-1);
    wr.out("})", true);
    return wr;
};
// write axios client endpoint for method
exports.WriteClientEndpoint = function (wr, cl, m) {
    var methodName = m.getName();
    // get function valid parameters...
    var validParams = m.getParameters().filter(function (p) {
        var t = p.getType();
        if (t.compilerType.symbol) {
            return false;
        }
        return true;
    });
    // method signature
    var signatureStr = validParams.map(function (p) {
        var t = p.getType();
        var typename = t.getText();
        if (t.compilerType.symbol) {
            typename = t.compilerType.symbol.escapedName + '';
        }
        return p.getName() + ": " + typename;
    }).join(', ');
    // setting the body / post varas is not as simple...
    var axiosGetVars = validParams.map(function (p) {
        var t = p.getType();
        var typename = t.getText();
        if (t.compilerType.symbol) {
            typename = t.compilerType.symbol.escapedName + '';
        }
        return '${' + p.getName() + '}';
    }).join('/');
    wr.out("// Service endpoint for " + methodName, true);
    wr.out("async " + methodName + "(" + signatureStr + ") : Promise<any> {", true);
    wr.indent(1);
    wr.out('return await axios.get(`/v1/' + methodName + '/' + axiosGetVars + '`);', true);
    wr.indent(-1);
    wr.out("}", true);
    return wr;
};
//# sourceMappingURL=service.js.map