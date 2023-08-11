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
      if (!IsCorrectCommand(event)) return;
      const StructArgs = ParseCommand(event);

      // No arguments.
      if (StructArgs.length > 1) return;
      if (StructArgs.at(0) === 'ping') {
        event.reply('🏓 Pong! My turn! ');
      };
    });
  };
};

import Mod_ICQQ from 'icqq';
function IsCorrectCommand(message: Mod_ICQQ.Message): boolean {
  const [firstBlock, secondBlock] = message.message;

  return (
    firstBlock?.type === 'text' &&
    secondBlock?.type === 'at' &&
    secondBlock.qq === ProcessContext.client.uin &&
    firstBlock.text.match(/\//g)?.length === 1 &&
    firstBlock.text.startsWith('/')
  );
};

function ParseCommand(message: Mod_ICQQ.Message): (string | [string, string])[] {
  var commandBlock = message.message[0];

  if (commandBlock?.type !== 'text')
    return [];

  var commandName = commandBlock.text.slice(1);
  var argument = message.raw_message
    .split(' ')
    .slice(1)
    .map(arg => {
      if ((/"/g).exec(arg)?.length === 1)
        return arg.split('=') as [string, string];

      return arg;
    });

  return [commandName, ...argument];
}