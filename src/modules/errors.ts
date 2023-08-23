class ErrorBase extends Error {
  public constructor(name: string, ...msg: any[]) {
    super(name, ...msg);
    this.name = name;
    this.message = msg.length <= 1
      ? msg[0]
      : `[${msg[0]}] ${msg[1]}`;
  };
};

class ErrorFileException extends ErrorBase {
  public constructor(...msg: any[]) {
    super('ErrorFileException', ...msg);
  };
};

class ErrorSymbolException extends ErrorBase {
  public constructor(...msg: any[]) {
    super('ErrorSymbolException', ...msg);
  };
};

class ErrorNetworkException extends ErrorBase {
  public constructor(...msg: any[]) {
    super('ErrorNetworkException', ...msg);
  };
};

class ErrorContextException extends ErrorBase {
  public constructor(...msg: any[]) {
    super('ErrorContextException', ...msg);
  };
};

class ErrorLoggerException extends ErrorBase {
  public constructor(...msg: any[]) {
    super('ErrorLoggerException', ...msg);
  };
};

global.Errors = {
  ErrorFileException,
  ErrorLoggerException,
  ErrorSymbolException,
  ErrorNetworkException,
  ErrorContextException
};
export { };