"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("json-format");
const node_fs_1 = __importDefault(require("node:fs"));
// globalThis.JsonEx;
class CjsonEx {
    constructor() { }
    ;
    parse(data) {
        data = this.ClearComments(data);
        try {
            return JSON.parse(data);
        }
        catch {
            var RawData = node_fs_1.default.readFileSync(data, {
                encoding: 'utf-8'
            });
            try {
                return JSON.parse(this.ClearComments(RawData));
            }
            catch (e) {
                throw new Errors.ErrorFileException('JsonExtra', 'Isn\'t file or raw string. ');
            }
            ;
        }
        ;
    }
    ;
    stringify(data) {
        return globalThis.JSONFormat(JSON.stringify(data));
    }
    ;
    ClearComments(string) {
        return string.split('\n').filter(val => !(val.startsWith('/') || val.startsWith('*'))).join('\n');
    }
    ;
}
;
global.JsonEx = new CjsonEx;
exports.default = new CjsonEx;
//# sourceMappingURL=jsonExtra.js.map