declare module '@babel/helper-plugin-utils' {
  import { ConfigAPI, PluginObj, PluginOptions } from '@babel/core';
  interface IPluginBuilder<T> {
    (api: ConfigAPI, options?: T): PluginObj;
  }
  export function declare<T extends PluginOptions>(builder: IPluginBuilder<T>): PluginObj;
}
