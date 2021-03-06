"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ts_simple_ast_1 = require("ts-simple-ast");
var R = require("robowr");
var ProgrammerBase = require("./programmer/service");
function create_project() {
    return __awaiter(this, void 0, void 0, function () {
        var project, sourceFile, RFs, webclient, clientWriter, injectWriter, services, swagger, serviceFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    project = new ts_simple_ast_1.default();
                    // const fileNames = process.argv.slice(2);
                    // manually add some files
                    project.addExistingSourceFileIfExists('src/backend/index.ts');
                    project.addExistingSourceFileIfExists('src/backend/api.ts');
                    sourceFile = project.getSourceFileOrThrow('src/backend/api.ts');
                    RFs = new R.CodeFileSystem();
                    webclient = RFs.getFile('/src/frontend/api/', 'index.ts').getWriter();
                    clientWriter = ProgrammerBase.CreateClientBase(webclient);
                    injectWriter = new R.CodeWriter();
                    services = webclient.getState().services = {};
                    // mapeservice classes to the properties
                    sourceFile.getClasses().forEach(function (c) {
                        c.getJsDocs().forEach(function (doc) {
                            var is_service = doc.getTags().filter(function (tag) { return tag.getName() === 'service'; }).length > 0;
                            if (is_service) {
                                webclient.getState().services[c.getName()] = {
                                    description: doc.getComment()
                                };
                                doc.getTags().forEach(function (tag) {
                                    webclient.getState().services[c.getName()][tag.getName()] = tag.getComment();
                                });
                            }
                        });
                    });
                    // initialize the Swagger to the code writer context
                    ProgrammerBase.initSwagger(webclient);
                    // find service declarations and create endpoints...
                    sourceFile.getClasses().forEach(function (c) {
                        if (services[c.getName()]) {
                            c.getMethods().forEach(function (m) {
                                ProgrammerBase.WriteEndpoint(injectWriter, project, c, m);
                                ProgrammerBase.WriteClientEndpoint(clientWriter, project, c, m);
                            });
                        }
                    });
                    swagger = RFs.getFile('/src/swagger/', 'api.json').getWriter();
                    swagger.raw(JSON.stringify(swagger.getState().swagger, null, 2));
                    serviceFile = project.getSourceFileOrThrow('src/backend/index.ts');
                    serviceFile.getFunction('automaticServices')
                        .setBodyText(function (writer) {
                        writer.setIndentationLevel('  ').write(injectWriter.getCode());
                    });
                    return [4 /*yield*/, RFs.saveTo('./', false)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, project.save()];
                case 2:
                    _a.sent();
                    console.log('Project saved');
                    return [2 /*return*/];
            }
        });
    });
}
create_project();
//# sourceMappingURL=tssimplec.js.map