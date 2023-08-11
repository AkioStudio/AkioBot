import Mod_ICQQ from 'icqq';
import Node_FS from 'node:fs';

; (async function PluginLoaderMain() {
  var pathList = Node_FS.readdirSync(process.cwd() + '/dist/plugins/', { encoding: 'utf-8' });
  pathList = pathList.filter(script => !script.endsWith('map'));

  for (let idx = 0; idx < pathList.length; idx ++){
    var script = pathList[idx];
    var fileName = script.split('.').slice(0, -1).join('.');
    var included = await import('./plugins/' + script);
    var classInit: CpluginBase | undefined = undefined;

    if (!Object.hasOwn(included, 'default')) {
      Logger.Warn(`Load plugin fail. ${fileName}, Lost export default. `);
      continue;
    };

    if (Object.hasOwn(included.default, 'default')) {
      included = included.default.default;
    };

    if (!['function', 'boolean', 'object'].includes(typeof included)) {
      Logger.Error(`Load plugin fail. ${fileName}, Incorrect export default. `);
      continue;
    };

    {
      if (typeof included == 'boolean') {
        if (included == false) {
          Logger.Info(`Load plugin aborted. ${fileName}, Plugin stopped import. `);
          continue;
        };
      };
      try {
        classInit = new included;
      } catch {
        try {
          classInit = included.call(ProcessContext.client);
        } catch {
          Logger.Warn(`Load plugin fail. ${fileName}, Hasn't any export yet. `);
          continue;
        }
      };
    };

    // if (included.default) {
    //   try {
    //     classInit = new included.default;
    //   } catch {
    //     try {
    //       classInit = new included.default.default;
    //     } catch {
    //       Logger.Error(`Load plugin fail. ${fileName}, Lost default class. `);
    //     };
    //   };
    // };
    if (classInit != undefined) {
      if (!classInit.registerInfo) {
        Logger.Warn(`Load plugin fail. Undefined information. `);
      };
      Logger.Info(`Load plugin. ${classInit.registerInfo.name}`);
    };
  };
})();

export default class CpluginBase {
  client: Mod_ICQQ.Client = ProcessContext.client; 
  logger: Logger = Logger;
  public constructor(
    readonly registerInfo: TpluginInformation
  ) { };
};