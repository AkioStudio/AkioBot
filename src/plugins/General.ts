import ScriptBase from '../pluginLoader';

export default class extends ScriptBase {
  public constructor() {
    super({
      name: 'General'
    });
    this.Init();
  };

  private Init() {
    this.client.on('message.group.normal', event => {
      const request = PluginCommon.request(event);
      if (request.IsFail) return;
      if (!request.IsForOwn) return;

      if (request.Command === 'ping' && request.Argument.length == 0) {
        event.reply('🏓 Pong! My turn! ');
      };
    });
  };
};