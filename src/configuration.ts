export interface IConfiguration {
  rootValue: number;
  unitPrecision: number;
  minPixelValue: number;
  multiplier: number;
  tags: ReadonlyArray<string>;
  propWhiteList: ReadonlyArray<string>;
  propBlackList: ReadonlyArray<string>;
  exclude: boolean;
  selectorBlackList: ReadonlyArray<string>;
  ignoreIdentifier: boolean;
  replace: boolean;
  mediaQuery: boolean;
  transformRuntime: boolean;
}

class ConfigurationManager {
  private static readonly defaultConfiguration: IConfiguration = {
    rootValue: 100,
    unitPrecision: 5,
    minPixelValue: 2,
    multiplier: 1,
    tags: ['styled', 'css', 'createGlobalStyle', 'keyframes'],
    propWhiteList: [],
    propBlackList: [],
    exclude: false,
    selectorBlackList: [],
    ignoreIdentifier: false,
    replace: true,
    mediaQuery: false,
    transformRuntime: false,
  };
  private _config: IConfiguration = ConfigurationManager.defaultConfiguration;

  public get config(): IConfiguration {
    return this._config;
  }

  public updateConfig(config?: Partial<IConfiguration>): void {
    if (config) {
      this._config = Object.assign({}, ConfigurationManager.defaultConfiguration, config);
    }
  }
}

export default new ConfigurationManager();
