import icqq from 'icqq';

type TsupportMsgType = icqq.GroupMessage | icqq.PrivateMessage
type TrequestStruct = {
  IsPrivate: boolean
  GroupId: number
  Sender: number;
  Command: string;
  Argument: string;
  Processor: number
};

class Crequest {
  private _IsCorrect?: boolean;
  private _RequestStruct: TrequestStruct = new Object as any;
  private _RawMessage!: TsupportMsgType;

  static Build(message: TsupportMsgType): Crequest {
    return new this(message);
  };

  private constructor(message: TsupportMsgType) {
    if ( //    /command@something args...
      message.message[0]?.type !== 'text'
      || message.message[0].text[0] !== '/'
      || message.message[0].text.includes(' ')
      || message.message[1].type !== 'at'
      || message.message[1].qq === 'all' // It impossible that bot's uin is "All"
    ) return;

    this._RawMessage = message;
    this._RequestStruct = {
      IsPrivate: message.message_type !== 'group',
      GroupId: message.message_type === 'group' ? message['group_id'] : 0,

      Sender: message.sender.user_id,
      Command: message.message[0].text.slice(1),
      Argument: message.raw_message.slice(
        message.message[0].text.length
        + `@${message.message[1].qq}`.length
      ).trim(),
      Processor: message.message[1].qq
    };

    if (this._RequestStruct.Argument !== ''
      && message.message[2].type == 'text'
      && message.message[2].text[0] !== ' '
    ) {
      this._RequestStruct.Argument = '';
    };
  };

  // --- --- --- --- --- --- //

  get IsFail(): boolean {
    return this._IsCorrect === false
  };

  get IsForOwn(): boolean {
    return this._RequestStruct?.Processor == ProcessContext.client.uin;
  };

  public IsAdmin(IsGroup: boolean = false): boolean {
    let status = false;
    let struct = this._RequestStruct;
    if (!struct.IsPrivate && IsGroup) {
      status = ProcessContext.client.pickGroup(struct.GroupId)
        .pickMember(struct.Sender).is_admin || status;
    };
    return status || struct.Sender === GetProjectConfig().environment.admin_id;
  };

  get Command(): string {
    return this._RequestStruct?.Command || '';
  };

  get Argument(): string[] {
    return (
      this._RequestStruct.Argument.split(' ')
        .filter(val => val !== '')
      || []
    );
  };
};

global['PluginCommon'] = {
  request: Crequest.Build.bind(Crequest)
};

export {
  Crequest
};
