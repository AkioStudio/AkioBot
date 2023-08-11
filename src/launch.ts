import './modules/index';
import Mod_ICQQ from 'icqq';
import * as Node_ReadLine from 'node:readline';

; (function ProcessMain() {
  var conf = GetProjectConfig();
  global.ProcessContext = {} as any;
  ProcessContext['terminalController'] = Node_ReadLine.createInterface(process.stdin, process.stdout);
  ProcessContext.terminalController.on('close', () => {
    if (ProcessContext.client.isOnline()) {
      ProcessContext.client.logout(false).then(() => {
        process.exit(0x0000);
      });
    } else process.exit(0x0000);
  });
  

  // check null
  for (let key of Object.values({...conf.account, ...conf.environment}))
    if (typeof key == 'object')
      throw new Errors.ErrorFileException('Missing Config. ');
  
  // check config
  if (!new RegExp(/[1-9][0-9]{4,14}/)
    .test(conf
      .account.qq_id
      .toString()
    )
  ) throw new Errors.ErrorContextException('Incorrect qq_id. ');

  if (0 > conf.environment.platform && conf.environment.platform > 6)
    throw new Errors.ErrorContextException('Incorrect platform. ');
  

  // create client context
  ProcessContext['client'] = Mod_ICQQ.createClient({
    data_dir: './account',
    platform: conf.environment.platform,
    sign_api_addr: conf.environment.qsign_api,
    resend: true,
    ignore_self: true,

    log_config: Logger.GetLog4JsSupport()
  });
})();

// require('./pluginLoader');
import './login';