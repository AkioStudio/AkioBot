// header //
import err from './errors';

declare global {
  interface Logger {
    symbol: Symbol;
    Log: (...data: any[]) => void;
    Info: (...data: any[]) => void;
    Warn: (...data: any[]) => void;
    Error: (...data: any[]) => void;
    Fatal: (...data: any[]) => void;
    Debug: (...data: any[]) => void;
    GetLog4JsSupport: () => any;
  };
  var Logger: Logger;

  interface JsonEx {
    /**
     * Parse the raw JSON data.
     * Receive File or Raw string.
     * @param data 
     */
    parse(data: string): object;
    parse<T>(data: string): T;

    /**
     * Convert the Object to Raw Json string data.
     * @param data 
     */
    stringify(data: object): string;
  };
  var JsonEx: JsonEx;

  interface Nets {
    /**
     * Recv the json data by URL
     * @param url
     */
    GetAsJSON(url: string): object;
  };
  var Nets: Nets;

  interface Errors {
    ErrorFileException: err.ErrorFileException;
    ErrorLoggerException: err.ErrorLoggerException;
    ErrorNetworkException: err.ErrorNetworkException;
    ErrorContextException: err.ErrorContextException;
  };
  var Errors: Errors;
};

export { };