var generalConfig = { } as TgeneralConfig;
LoadProjectConfig();

function LoadProjectConfig() {
  generalConfig = JsonEx.parse<TgeneralConfig>(process.cwd() + '/general.config');
};

function GetProjectConfig(): Readonly<TgeneralConfig> {
  return {...generalConfig};
};

function GetValueByProjectPath(path: string): any {
  var step = path.split('.');
  for (const key in generalConfig) {
    if (key == step[0]) {
      return (generalConfig as any)[key][step[1]];
    };
  };
};

global['LoadProjectConfig'] = LoadProjectConfig.bind(LoadProjectConfig);
global['GetProjectConfig'] = GetProjectConfig.bind(GetProjectConfig);
global['GetValueByProjectPath'] = GetValueByProjectPath.bind(GetValueByProjectPath);

export { };