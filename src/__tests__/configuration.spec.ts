import { ConfigurationManager } from '../configuration';

describe('configuration', () => {
  let configuration: ConfigurationManager;
  beforeEach(() => {
    configuration = new ConfigurationManager();
  });
  it('should return default configuration', function() {
    expect(configuration.config).toEqual({
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
    });
  });
  it('should return update configuration', function() {
    expect(configuration.config).toEqual({
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
    });
    configuration.updateConfig({ rootValue: 75, tags: ['sty', 'inject'] });
    expect(configuration.config).toEqual({
      rootValue: 75,
      unitPrecision: 5,
      minPixelValue: 0,
      multiplier: 1,
      tags: ['sty', 'inject'],
      propWhiteList: [],
      propBlackList: [],
      exclude: false,
      selectorBlackList: [],
      ignoreIdentifier: false,
      replace: true,
      mediaQuery: false,
      transformRuntime: false,
    });
  });
  it('should return ignored undefined config', function() {
    expect(configuration.config).toEqual({
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
    });
    configuration.updateConfig({});
    expect(configuration.config).toEqual({
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
    });
  });
});
