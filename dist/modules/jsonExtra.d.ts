import 'json-format';
declare class CjsonEx implements JsonEx {
    constructor();
    parse(data: string): object;
    stringify(data: object): string;
}
declare const _default: CjsonEx;
export default _default;
