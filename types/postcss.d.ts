declare module 'postcss-plugin-px2rem' {
  import { Plugin } from 'postcss';
  interface IPx2RemOptions {
    rootValue: number;
    unitPrecision: number;
    minPixelValue: number;
    propWhiteList: ReadonlyArray<string>;
    propBlackList: ReadonlyArray<string>;
    exclude: boolean;
    selectorBlackList: ReadonlyArray<string>;
    ignoreIdentifier: boolean;
    replace: boolean;
    mediaQuery: boolean;
  }

  const px2rem: Plugin<IPx2RemOptions>;

  export = px2rem;
}
declare module 'postcss-scss';
