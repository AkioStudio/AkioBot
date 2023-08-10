"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
;
(function PluginLoaderMain() {
    var pathList = node_fs_1.default.readdirSync(process.cwd() + '/dist/plugins/', { encoding: 'utf-8' });
    pathList = pathList.filter(script => !script.endsWith('map'));
    pathList.forEach(async (script) => {
        var fileName = script.split('.').slice(0, -1).join('.');
        var included = await import('./plugins/' + script);
        Logger.Info(`Load plugin. ${fileName}`);
        if (included.default) {
            try {
                new included.default;
            }
            catch {
                try {
                    new included.default.default;
                }
                catch {
                    Logger.Error(`Load plugin fail. ${fileName}, Lost default class. `);
                }
                ;
            }
            ;
        }
        ;
    });
})();
class CpluginBase {
    client = ProcessContext.client;
    logger = Logger;
    constructor(registerInfo) { }
    ;
}
exports.default = CpluginBase;
;
//# sourceMappingURL=pluginLoader.js.map