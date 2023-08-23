import loader from '../pluginLoader_v2';
export default class extends loader.ScriptBase {
  public constructor() {
    super({
      name: 'eee',
      version: [0, 0, 1],
      repo: '',
      updateRepo: ''
    });
  };

  public async PluginInit() {
    console.log('I was loaded! ');
    this.RegisterRequest('ping', 'foo');
    return;
  };
  
  public foo(event: any) {
    event?.reply('My turn');
  }
};