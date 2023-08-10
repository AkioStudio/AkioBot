"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pngjs_1 = __importDefault(require("pngjs"));
(function LoginMain() {
    this.on('system.login.qrcode', event => {
        console.log('Scan the QRCODE to login. ');
        PrintQRCode();
        ProcessContext.terminalController.once('line', noop => {
            this.qrcodeLogin();
        });
        function PrintQRCode() {
            const png = pngjs_1.default.PNG.sync.read(event.image);
            for (let i = 36; i < png.height * 4 - 36; i += 24) {
                let line = "";
                for (let j = 36; j < png.width * 4 - 36; j += 12) {
                    let bgcolor = (png.data[i * png.width + j] == 255)
                        ? '\x1b[47m'
                        : '\x1b[40m';
                    let fgcolor = (png.data[i * png.width + j + (png.width * 4 * 3)] == 255)
                        ? '\x1b[37m'
                        : '\x1b[30m';
                    line += `${fgcolor + bgcolor}\u2584`;
                }
                ;
                console.log(line + '\x1b[0m');
            }
            ;
        }
        ;
    })
        .on('system.login.slider', event => {
        console.log('Pass the verify from the URL, and get its ticket. ');
        console.log(event.url);
        ProcessContext.terminalController.once('line', ticket => {
            this.submitSlider(ticket);
        });
    })
        .on('system.login.device', event => {
        console.log(`Dear ${event.phone}, `);
        console.log('Device verify, select: A sms-code | B Verify Online | ELSE quit. ');
        ProcessContext.terminalController.once('line', choose => {
            choose = choose.toLowerCase();
            if (choose == 'a') {
                this.sendSmsCode();
                ProcessContext.terminalController.once('line', ticket => {
                    this.submitSmsCode(ticket);
                });
            }
            else if (choose == 'b') {
                console.log('Pass it! ', event.url);
            }
            else {
                this.logout(false).then(() => process.exit(0x01));
            }
            ;
        });
    });
    this.on('system.online', () => {
        Logger.Info('Account Online!');
        if (!ProcessContext.processInit) {
            ProcessContext['processInit'] = true;
            Logger.Info('Start! Plugin.');
        }
        ;
    })
        .on('system.offline', err => {
        Logger.Info('Account Offline, ', err.message);
    })
        .on('system.login.error', err => {
        console.error('ERR, ', err.code, err.message);
    });
    var conf = GetProjectConfig();
    // 原神，启动！
    this.login(conf.account.qq_id, conf.account.password);
}).call(ProcessContext.client);
//# sourceMappingURL=login.js.map