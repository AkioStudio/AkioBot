"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorBase extends Error {
    constructor(name, ...msg) {
        super(name, ...msg);
        this.name = name;
        this.message = msg.length <= 1
            ? msg[0]
            : `[${msg[0]}] ${msg[1]}`;
    }
    ;
}
;
class ErrorFileException extends ErrorBase {
    constructor(...msg) {
        super('ErrorFileException', ...msg);
    }
    ;
}
;
class ErrorNetworkException extends ErrorBase {
    constructor(...msg) {
        super('ErrorNetworkException', ...msg);
    }
    ;
}
;
class ErrorContextException extends ErrorBase {
    constructor(...msg) {
        super('ErrorContextException', ...msg);
    }
    ;
}
;
class ErrorLoggerException extends ErrorBase {
    constructor(...msg) {
        super('ErrorLoggerException', ...msg);
    }
    ;
}
;
global.Errors = {
    ErrorFileException,
    ErrorLoggerException,
    ErrorNetworkException,
    ErrorContextException
};
//# sourceMappingURL=errors.js.map