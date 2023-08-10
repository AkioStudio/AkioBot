import Mod_ICQQ from 'icqq';
import Node_FS from 'node:fs';

; (function PluginLoaderMain() {
  var pathList = Node_FS.readdirSync(process.cwd() + '/dist/plugins/', { encoding: 'utf-8' });
  pathList = pathList.filter(script => !script.endsWith('map'));

  pathList.forEach(async script => {
    var fileName = script.split('.').slice(0, -1).join('.');
    var included = await import('./plugins/' + script);

    Logger.Info(`Load plugin. ${fileName}`);
    if (included.default) {
      try {
        new included.default;
      } catch {
        try {
          new included.default.default;
        } catch {
          Logger.Error(`Load plugin fail. ${fileName}, Lost default class. `);
        };
      };
    };
  });
})();

export default class CpluginBase {
  client: Mod_ICQQ.Client = ProcessContext.client; 
  logger: Logger = Logger;
  public constructor(
    registerInfo: TpluginInformation
  ) { };
};