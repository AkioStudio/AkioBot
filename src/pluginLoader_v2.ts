import icqq from 'icqq';
import node_fs from 'node:fs'
import node_path from 'node:path';
import node_crypto from 'node:crypto';

type TpluginInfo = {
  uuid: string,
  fileName: string,
  context: ScriptBase
};

type TrequestInfo = {
  name: string,
  callback: string,
  scoureUUID: string,
  options: TrequestOption
};

type TrequestOption = {
  zIndex: number
  target: 'group' | 'private'
  premission: icqq.GroupRole
};

var _pluginUuidMap = new Map<string, string>;
var _pluginMap = new Map<string, TpluginInfo>;
var _requestMap = new Set<TrequestInfo>;

class ScriptLoader {
  public EventDispatcher;
  public constructor() {
    this.EventDispatcher = new ScriptEventDispatcher(
      ProcessContext.client
    );
    this.ScriptDispatcher();
  };

  get PluginMap(): Map<string, TpluginInfo> {
    return _pluginMap;
  };

  /**
   * @description Load one or All script.
   * @param file script file path.
   * @return Return status.
   */
  public async LoadScript(file?: string): Promise<boolean> {
    if (!file) {
      try {
        var Files = node_fs.readdirSync(__dirname + '/test/', { withFileTypes: true, encoding: 'utf-8' });
      } catch (err) {
        throw err;
      };

      for (const file of Files) {
        if (!file.isFile
          || !file.name.endsWith('.js')
        ) continue;

        this.LoadScript(file.path + file.name);
      };

      return true;
    };

    var CurrentUUID = node_crypto.randomUUID();
    if (_pluginUuidMap.has(file))
      return false;

    try {
      var Plugin = await this.ImportScript(file);
    } catch (err) {
      throw err;
    };

    Plugin.__uuid__ = CurrentUUID;
    Plugin
      .PluginInit()
      .catch(err => {
        Logger.Error(err['name']);
      }).then(() => {
        Logger.Info('Successfully load Script', Plugin.RegisterConfig.name, '. ');
      });

    _pluginUuidMap.set(file, CurrentUUID);
    _pluginMap.set(CurrentUUID, {
      uuid: CurrentUUID,
      fileName: file,
      context: Plugin
    });
    return true;
  };

  /**
  * @description Unload one or All script.
  * @param uuid script uuid.
  * @param disable Disable that, just won't let it works.
  */
  public async UnloadScript(uuid?: string): Promise<boolean> {
    if (!uuid) {
      _pluginMap.clear();
      _pluginUuidMap.clear();
      return true;
    };

    let idx = [..._pluginUuidMap.values()].indexOf(uuid);
    if (idx === -1) return false;
    _pluginMap.delete(uuid);
    _pluginUuidMap.delete([..._pluginUuidMap.keys()][idx]);
    return true;
  };

  public OutputMapList() {
    Logger.Log('———————————— OutputScriptMap ——————————');

    Logger.Log('RegisterPluginScript:');
    [..._pluginUuidMap.entries()].forEach((val, idx) => {
      var data = _pluginMap.get(val[1]);
      Logger.Log(`${idx}. ${data?.context.PLUGIN_NAME} - ${data?.uuid} (${val[0]})`);
    });

    Logger.Log('');
    Logger.Log('');

    Logger.Log('RegisterRequest:');
    [..._requestMap.values()].forEach((val, idx) => {
      Logger.Log(`${idx}. ${val.name}@${val.callback}#${val.scoureUUID} idx-${val.options.zIndex}`);
    });
  };

  private async ImportScript(filePath: string): Promise<ScriptBase> {
    var Data = await import('./' + node_path.relative(__dirname, filePath));

    if (!Object.hasOwn(Data, 'default'))
      throw new Errors.ErrorFileException('PluginLoader', 'Script Default-Export Class Missing. ');

    Data = typeof Data.default !== 'function' ? Data.default : Data;

    try {
      return new Data.default;
    } catch (err) {
      throw new Errors.ErrorContextException('PluginLoader', 'Incorrect Script. ', filePath);
    };
  };

  private async ScriptDispatcher() {
    const Client = ProcessContext.client;
    Client.on('message.group.normal', ev => { this.EventDispatcher.GroupEventDispatcher(ev) });
  };
};

class ScriptEventDispatcher {
  public constructor(
    private Client: icqq.Client
  ) {};
  /**
   * 群聊消息事件调度
   */
  public async GroupEventDispatcher(event: icqq.GroupMessageEvent) {
    if (!IsRequest(event)) return;

    const BotId = this.Client.uin;
    const Raw = event.raw_message.replace(
        (await event.group.getMemberMap(true)).get(BotId)!.card || this.Client.nickname,
        String(BotId)
      );

    const RequestArr = [..._requestMap.values()].filter(val => val.options.target === 'group');
    for (let idx = 0; idx < RequestArr.length; idx++) {
      const Request = RequestArr[idx];

      if(!CheckRequestPermission(event, Request.options)) continue;

      let RequestBlocks = Raw.split(' ');
      var RequestCmd = RequestBlocks[0];
      var RequestArg = RequestBlocks[1];

      console.info(Request.name, RequestCmd)
      if (!(new RegExp(Request.name)).test(RequestCmd)) continue;

      (_pluginMap.get(Request.scoureUUID) as any)
        ?.context[Request.callback](event, RequestBlocks);
      
      break;
    };
  };
};

class ScriptCommon {
  public __uuid__: string = '';

  public constructor(
    readonly PLUGIN_NAME: string
  ) { };

  /**
  * @description Register a simple request.
  * @param name toggleName, regex fomrat.
  * @param callback callbackName, must class-function.
  * @param [zIndex=32767] zIndex, Smaller and More prior.
  * @param disable Disable that, just won't let it works.
  */
  public RegisterRequest(name: string, callback: string, options?: Partial<TrequestOption>) {
    CheckRequestSymbol(this.PLUGIN_NAME, name = '/' + name);
    if ([..._requestMap.entries()].map(val => val[0].name).includes(name))
      return Logger.Info(`${this.PLUGIN_NAME}@${name}() Has been registered. `);

    _requestMap.add({
      name: `\\${name}@${ProcessContext.client.uin || NaN}`,
      callback: callback,
      scoureUUID: this.__uuid__,
      options: DefaultRequestOption(options)
    });
    SortReuquestIndex();
  };

  /**
    * @description Register a extra request.
    * @param name toggleName, regex fomrat.
    * @param callback callbackName, must class-function.
    * @param [zIndex=32767] zIndex, Smaller and More prior.
    * @param disable Disable that, just won't let it works.
    */
  public RegisterRequestEx(name: string, callback: string, options?: TrequestOption) {
    CheckRequestSymbol(this.PLUGIN_NAME, name);
    if ([..._requestMap.entries()].map(val => val[0].name).includes(name)) {
      Logger.Info(`${this.PLUGIN_NAME}@${name}() Has been registered. `);
      return;
    };

    _requestMap.add({
      name: `${name}`,
      callback: callback,
      scoureUUID: this.__uuid__,
      options: DefaultRequestOption(options)
    });
    SortReuquestIndex();
  };

  /**
   * @deprecated Unsafe
   * @description Get client.
   * @param callback 
   */
  public CustomProcessor(callback: (client: icqq.Client) => void) {
    new Promise($ => { callback(ProcessContext.client); $(undefined); });
  };
};

class ScriptBase extends ScriptCommon {
  public constructor(
    public readonly RegisterConfig: {
      name: string, // Plugin Name
      author?: string, // Developer
      version: [number, number, number], // Version
      repo: string, // Origin Resource Repo URL
      updateRepo: string // Update URI
    }
  ) {
    super(RegisterConfig.name)
  };

  /**
   * @virtual
   * @description When the Script loads, Here will be called first.
   */
  public async PluginInit() { };
};

export default {
  ScriptLoader,
  ScriptBase
};

function IsRequest(message: icqq.Message): boolean {
  var Block = message.message;
  if (Block[0].type != 'text'
    || Block[1]?.type != 'at'
    || (Block[2] && Block[2].type != 'text')
  ) return false;

  try {
    CheckRequestSymbol('', Block[0].text);
  } catch { return false };

  return true;
};

function CheckRequestSymbol(plugin: string, name: string) {
  if (!(/[`~!@#$%^&*()_+<>?:" {},./;'[\]·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im).test(name[0]))
    throw new Errors.ErrorSymbolException(plugin, name);

  if (name.includes(' '))
    throw new Errors.ErrorSymbolException(plugin, name);
};

function CheckRequestPermission(message: icqq.GroupMessage | icqq.PrivateMessage, option: TrequestOption) {
  const Owner = GetProjectConfig().environment.admin_id;
  if (message.message_type === 'group') {
    if (option.premission === 'owner' && message.sender.user_id ^ Owner)
      return false;

    if (option.premission === 'admin' && message.sender.role !== 'admin')
      return false;

    return true;
  };

  if (option.premission === 'admin')
    return false;

  if (option.premission === 'owner' && message.sender.user_id ^ Owner)
    return false;

  return true;
};

function SortReuquestIndex() {
  let RequestArray = [..._requestMap.values()];
  RequestArray.sort((a, b) => b.options.zIndex - a.options.zIndex);
  _requestMap = new Set(RequestArray);
};

function DefaultRequestOption(option?: Partial<TrequestOption>): TrequestOption {
  return {
    zIndex: option?.zIndex ?? 1000,
    target: option?.target ?? 'group',
    premission: option?.premission ?? 'member',
  };
};