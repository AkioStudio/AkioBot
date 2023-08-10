import Mod_ICQQ from 'icqq';
import * as Node_ReadLine from 'node:readline';

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
      qsign_api: string
    }
  };

  type TprocessContext = {
    processInit: boolean

    client: Mod_ICQQ.Client
    terminalController: Node_ReadLine.Interface
  };

  type TpluginInformation = {
    name: string, version?: [number, number, number, string],
    author?: string, repo?: string
  }

  var LoadProjectConfig: () => void;
  var GetProjectConfig: () => TgeneralConfig;
  var GetValueByProjectPath: (path: string) => any;

  var ProcessContext: TprocessContext;
};

export { };