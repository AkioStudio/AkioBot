"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var generalConfig = {};
LoadProjectConfig();
function LoadProjectConfig() {
    generalConfig = JsonEx.parse(process.cwd() + '/general.config');
}
;
function GetProjectConfig() {
    return { ...generalConfig };
}
;
function GetValueByProjectPath(path) {
    var step = path.split('.');
    for (const key in generalConfig) {
        if (key == step[0]) {
            return generalConfig[key][step[1]];
        }
        ;
    }
    ;
}
;
global['LoadProjectConfig'] = LoadProjectConfig.bind(LoadProjectConfig);
global['GetProjectConfig'] = GetProjectConfig.bind(GetProjectConfig);
global['GetValueByProjectPath'] = GetValueByProjectPath.bind(GetValueByProjectPath);
//# sourceMappingURL=config.js.map