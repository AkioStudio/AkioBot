"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
var FailTimes = 0;
let currentDate = new Date;
const FirstRunningTime = currentDate // 啊？
    .toISOString()
    .replace(/T.+Z/, currentDate
    .valueOf()
    .toString());
global.Logger = {};
class Clogger {
    constructor() { }
    ;
    static Log(...data) {
        this.defLog('Log', ...data);
    }
    ;
    static Info(...data) {
        this.defLog('Info', ...data);
    }
    ;
    static Warn(...data) {
        this.defLog('Warn', ...data);
    }
    ;
    static Error(...data) {
        this.defLog('Error', ...data);
    }
    ;
    static Fatal(...data) {
        this.defLog('Fatal', ...data);
    }
    ;
    static Debug(...data) {
        this.defLog('Debug', ...data);
    }
    ;
    static defLog(type, ...data) {
        // typedef
        var raw = data.map(block => {
            switch (typeof block) {
                case "object": {
                    return JsonEx.stringify(block);
                }
                case "function": {
                    block = block;
                    return block.name + `@${block.arguments}()`;
                }
                default: {
                    return String(block);
                }
            }
        }).join(' ');
        raw = `${(new Date).toISOString()} - ${type} - ${raw}`;
        console.info(raw);
        node_fs_1.default.appendFile(`${process.cwd()}/logs/${FirstRunningTime}.log`, raw + '\n', {
            flag: 'a+'
        }, err => {
            if (!err)
                return;
            throw new Errors.ErrorLoggerException('Append file fail. ');
        });
    }
    ;
}
;
Object.defineProperty(Logger, 'Log', {
    get: () => Clogger.Log.bind(Clogger),
    enumerable: true,
});
Object.defineProperty(Logger, 'Info', {
    get: () => Clogger.Info.bind(Clogger),
    enumerable: true,
});
Object.defineProperty(Logger, 'Warn', {
    get: () => Clogger.Warn.bind(Clogger),
    enumerable: true,
});
Object.defineProperty(Logger, 'Error', {
    get: () => Clogger.Error.bind(Clogger),
    enumerable: true,
});
Object.defineProperty(Logger, 'Fatal', {
    get: () => Clogger.Fatal.bind(Clogger),
    enumerable: true,
});
Object.defineProperty(Logger, 'Debug', {
    get: () => Clogger.Debug.bind(Clogger),
    enumerable: true,
});
Object.defineProperty(Logger, 'GetLog4JsSupport', {
    value: () => {
        return {
            appenders: {
                LoggerSupport: {
                    type: 'console'
                }
            },
            categories: {
                default: {
                    appenders: ['LoggerSupport'],
                    level: 'ALL'
                }
            }
        };
    },
    writable: false,
    enumerable: true,
});
console.log = (...data) => {
    if (data[0].includes(' [MARK] [icqq] - ')) {
        if (!GetProjectConfig().environment.debug)
            return;
        data[0] = data[0].slice(44).trimStart();
        Logger.Debug('Module-ICQQ -', ...data);
        return;
    }
    ;
    console.info(...data);
};
Logger.Info('-< >- Start Logging. -< >-');
process.on('uncaughtException', (error, origin) => {
    Logger.Warn(`${error.name} happend. Reason: ${error.message}
Then NodeJS ORIGIN: ${origin}`);
    FailTimes += 1;
})
    .on('unhandledRejection', async (reason, prprpr) => {
    Logger.Warn(`UnHandleRejection happend. Reason: ${reason} (bruh).`);
    FailTimes += 1;
})
    .on('beforeExit', () => {
    Logger.Info('-< >- Stop Logging. -< >-');
});
// Watch dog.
setInterval(() => {
    if (FailTimes > 50) {
        console.error(`Stupid! Watchdog count out!. Cur : ${FailTimes} (Max: 50)`);
        process.exit(0xE002);
    }
    ;
    FailTimes -= 1;
}, 1000);
//# sourceMappingURL=logger.js.map