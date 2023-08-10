import 'json-format';
import Node_FS from 'node:fs';

// globalThis.JsonEx;
class CjsonEx implements JsonEx {
  public constructor() { };

  public parse<T>(data: string): T | object {
    data = this.ClearComments(data);
    try {
      return JSON.parse(data);
    } catch {
      var RawData = Node_FS.readFileSync(data, {
        encoding: 'utf-8'
      });
      try {
        return JSON.parse(this.ClearComments(RawData));
      } catch (e) {
        throw new Errors.ErrorFileException('JsonExtra', 'Isn\'t file or raw string. ');
      };
    };
  };

  public stringify(data: object): string {
    return globalThis.JSONFormat(JSON.stringify(data));
  };

  private ClearComments(string: string): string {
    return string.split('\n').filter(val => !(val.startsWith('/') || val.startsWith('*'))).join('\n');
  };
};

global.JsonEx = new CjsonEx;
export default new CjsonEx;