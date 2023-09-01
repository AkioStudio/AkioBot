import icqq from 'icqq';
import loader from '../pluginLoader_v2';
// @ts-ignore
const fetch = (...args: any[]) => import('node-fetch').then(({default: fetch}) => fetch(...args));




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
    this.RegisterRequest('ping', 'Ping');
    this.RegisterRequest('query_ban', 'BanQuery');

    this.RegisterRequest('json', 'Json', {
      premission: 'owner'
    });
    return;
  };
  
  public Ping(event: icqq.GroupMessageEvent) {
    event?.reply('🏓 *Pong!');
  };

  public Json(event: icqq.GroupMessageEvent, data: string) {
    event.reply(icqq.segment.json(data));
  };

  public BanQuery(event: icqq.GroupMessageEvent) {
    this.CustomProcessor(async client => {
      await GetBotBannedList.call(client, event.reply.bind(event));
    });
  };
};


const violation_list = Object.values(
  JsonEx.parse(__dirname + '/Account/violation.json')
);

async function GetBotBannedList(
  this: icqq.Client,
  reply: (a: icqq.Sendable, b?: boolean) => Promise<any>
) {
  const UserId = this.uin;
  const AppId = 1109907872;
  const Count = 20;

  let LightAppCode: number | undefined;

  // Get Code From AppId
  {
    const object = {
      1: 3,
      2: this.apk.qua || `V1_AND_SQ_${this.apk.ver}_1234_YYB_D`,
      3: `i=${this.device.guid.toString('hex')}&imsi=&mac=${this.device.mac_address}&m=${this.device.model}&o=0&a=0&sd=0&c64=1&sc=1&p=1080*2221&aid=${this.device.guid.toString('hex')}&f=${this.device.brand}&mm=00&cf=00&cc=00&qimei=&qimei36=&sharpP=1&n=wifi&support_xsj_live=true&this_mod=default`,
      4: { 1: String(AppId) },
      5: String(UserId)
    };

    const payload = await this.sendUni(
      'LightAppSvc.mini_program_auth.GetCode',
      icqq.core.pb.encode(object)
    );
    const result = icqq.core.pb.decode(payload);
    LightAppCode = icqq.core.pb.decode(result[4].toBuffer())[2].toString();
  }

  if (!LightAppCode) {
    Logger.Error(`Account@GetBotBannedList -> Get code fail.`);
    return false;
  }

  const QueryUrl = 'https://minico.qq.com/minico/oauth20?uin=QQ%E5%AE%89%E5%85%A8%E4%B8%AD%E5%BF%83';
  const QueryOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      code: LightAppCode,
      appid: AppId,
      platform: 'qq'
    })
  };

  const result = await (await fetch(QueryUrl, QueryOptions)).json() as any;
  if (result.retcode !== 0 || !result.data) {
    Logger.Error(`Account@GetBotBannedList -> ApiAuth login fail.`);
    return false;
  }

  const Data = result.data;
  Data.token = Data.minico_token;
  delete Data.minico_token;
  delete Data.expire;

  const Argument = {
    appid: AppId,
    ...Data
  };
  const argumentString = Object.entries(Argument)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  const queryUrl = `https://minico.qq.com/minico/cgiproxy/v3_release/v3/getillegalityhistory?${argumentString}`;
  QueryOptions.body = JSON.stringify({
    com: {
      src: 0,
      scene: 1001,
      platform: 2,
      version: `"${this.apk.version}"`
    },
    pageNum: 0,
    pageSize: Count
  });

  const QueryResult = await (await fetch(queryUrl, QueryOptions)).json() as any;
  if (QueryResult.retcode !== 0 || !QueryResult.records) {
    Logger.Error(`Account@GetBotBannedList -> Query records fail.`);
    return false;
  }

  const Records = QueryResult.records;
  if (Records.totalSize < 1) {
    reply("Haven't any banned-record yet. ");
    return true;
  }

  const MsgList: icqq.Forwardable[] = [];
  for (const Record of Records) {
    const Violation_info = violation_list.find(val => val.reason === Record.reason)!;

    const KeepDays = Record.duration > 0
      ? `(${Math.ceil((Record.duration - Record.time) / 86400)}d)`
      : '';
    const Reason = Violation_info.reasonDesc === ''
      ? Violation_info.title
      : `${Violation_info.reasonDesc} ${KeepDays}`;

    MsgList.push({
      user_id: UserId,
      nickname: (new Date).valueOf().toString(),
      message: [
        `BeginDate：${new Date(Record.time * 1000 + 28800000).toISOString()}`,
        `BanReason：${Reason}`,
        `Description：${Violation_info.description}`
      ].join('\n')
    });
  };

  reply(await this.makeForwardMsg(MsgList));
  return true;
}
