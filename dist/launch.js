"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./modules/index");
const icqq_1 = __importDefault(require("icqq"));
const Node_ReadLine = __importStar(require("node:readline"));
;
(function ProcessMain() {
    var conf = GetProjectConfig();
    global.ProcessContext = {};
    ProcessContext['terminalController'] = Node_ReadLine.createInterface(process.stdin, process.stdout);
    ProcessContext.terminalController.on('close', () => {
        if (ProcessContext.client.isOnline()) {
            ProcessContext.client.logout(false).then(() => {
                process.exit(0x0000);
            });
        }
        ;
    });
    // check null
    for (let key of Object.values({ ...conf.account, ...conf.environment }))
        if (typeof key == 'object')
            throw new Errors.ErrorFileException('Missing Config. ');
    // check config
    if (!new RegExp(/[1-9][0-9]{4,14}/)
        .test(conf
        .account.qq_id
        .toString()))
        throw new Errors.ErrorContextException('Incorrect qq_id. ');
    if (0 > conf.environment.platform && conf.environment.platform > 6)
        throw new Errors.ErrorContextException('Incorrect platform. ');
    // create client context
    ProcessContext['client'] = icqq_1.default.createClient({
        data_dir: './account',
        platform: conf.environment.platform,
        sign_api_addr: conf.environment.qsign_api,
        resend: true,
        ignore_self: true,
        log_config: Logger.GetLog4JsSupport()
    });
})();
// require('./pluginLoader');
require("./login");
//# sourceMappingURL=launch.js.map