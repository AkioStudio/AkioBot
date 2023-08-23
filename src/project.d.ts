import Mod_ICQQ from 'icqq';
import * as Node_ReadLine from 'node:readline';
import * as Mod_PluginCommon from './pluginCommon';

declare global {
  type TgeneralConfig = {
    account: {
      nickname: string,
      qq_id: number,
      password: string
    },
    environment: {
      debug: boolean;
      platform: Mod_ICQQ.Platform,
      admin_id: number,
      qsign_api: string
    }
  };

  type TprocessContext = {
    processInit: boolean

    client: Mod_ICQQ.Client
    terminalController: Node_ReadLine.Interface
  };

  type TpluginInformation = {
    name: string,
    author?: string,
    repo?: string,
    version?: [number, number, number, string]
  };
  
  var LoadProjectConfig: () => void;
  var GetProjectConfig: () => TgeneralConfig;
  var GetValueByProjectPath: (path: string) => any;

  var ProcessContext: TprocessContext;

  interface IpluginCommon {
    request: (message: Mod_ICQQ.GroupMessage | Mod_ICQQ.PrivateMessage) => Mod_PluginCommon.Crequest;
  };

  var PluginCommon: IpluginCommon;
};

export { };