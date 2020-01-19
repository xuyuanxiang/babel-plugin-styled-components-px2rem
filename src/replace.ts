import postcss from 'postcss';
import memoize from 'memoizerific';
import px2rem from 'postcss-plugin-px2rem';
import scss from 'postcss-scss';
import configuration from './configuration';

const FAKE_OPENING_WRAPPER = 'styled-fake-wrapper/* start of styled-fake-wrapper */{';
const FAKE_CLOSING_WRAPPER = '}/* end of styled-fake-wrapper */';
const FAKE_RULE = '/* start of styled-fake-rule */padding:/* end of styled-fake-rule */';
const PAIR_REG = /[\s\w-]+:([\s-\d]+px)+/;
const PX_UNIT_REG = /([\s-\d]+px)+/;

function process(css: string): string {
  const { tags, multiplier, rootValue, ...others } = configuration.config;
  return postcss([px2rem({ ...others, rootValue: rootValue / multiplier })]).process(css, {
    syntax: scss,
  }).css;
}

function replaceWithRetry(cssText: string, retry = 1): string {
  try {
    if (PAIR_REG.test(cssText)) {
      const replaced = process(`${FAKE_OPENING_WRAPPER}${cssText}${FAKE_CLOSING_WRAPPER}`);
      return replaced.replace(FAKE_OPENING_WRAPPER, '').replace(FAKE_CLOSING_WRAPPER, '');
    } else if (PX_UNIT_REG.test(cssText)) {
      const replaced = process(`${FAKE_RULE}${cssText}`);
      return replaced.replace(FAKE_RULE, '');
    } else {
      return cssText;
    }
  } catch (ignored) {
    if (retry > 0) {
      return cssText
        .split(';')
        .map(token => replaceWithRetry(token, retry - 1))
        .join(';');
    } else {
      return cssText;
    }
  }
}

export const replace = memoize(10)(function(cssText: string): string {
  return replaceWithRetry(cssText);
});
