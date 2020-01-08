import { identifier, Identifier, numericLiteral, Statement } from '@babel/types';
import templateBuild from '@babel/template';
import { IConfiguration } from './configuration';

const source = `function %%px2rem%%(%%input%%, ...args) {
    if (typeof %%input%% === 'function') return %%px2rem%%(%%input%%(...args), ...args);
    var value = typeof %%input%% === 'string' ? parseFloat(%%input%%) : typeof %%input%% === 'number' ? %%input%% : 0;
    var pixels = (Number.isNaN(value) ? 0 : value);
    if (Math.abs(pixels) < %%minPixelValue%%) return pixels + 'px';
    var mul = Math.pow(10, %%unitPrecision%% + 1);
    return ((Math.round(Math.floor(((pixels  * %%multiplier%%) / %%rootValue%%) * mul) / 10) * 10) / mul) + 'rem';
}`;

export type IPx2remOptions = Pick<IConfiguration, 'rootValue' | 'unitPrecision' | 'multiplier' | 'minPixelValue'>;

export default (_px2rem: Identifier, config: IPx2remOptions): Statement => {
  const template = templateBuild.statement(source);
  return template({
    input: identifier('input'),
    px2rem: _px2rem,
    rootValue: numericLiteral(config.rootValue),
    unitPrecision: numericLiteral(config.unitPrecision),
    multiplier: numericLiteral(config.multiplier),
    minPixelValue: numericLiteral(config.minPixelValue),
  });
};
