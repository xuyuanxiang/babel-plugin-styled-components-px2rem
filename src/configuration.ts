export interface IConfiguration {
  readonly rootValue: number;
  readonly unitPrecision: number;
  readonly minPixelValue: number;
  readonly multiplier: number;
  readonly tags: ReadonlyArray<string>;
  readonly propWhiteList: ReadonlyArray<string>;
  readonly propBlackList: ReadonlyArray<string>;
  readonly exclude: boolean;
  readonly selectorBlackList: ReadonlyArray<string>;
  readonly ignoreIdentifier: boolean;
  readonly replace: boolean;
  readonly mediaQuery: boolean;
  readonly transformRuntime: boolean;
}

export class ConfigurationManager {
  private static readonly defaultConfiguration: IConfiguration = {
    rootValue: 100,
    unitPrecision: 5,
    minPixelValue: 0,
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
