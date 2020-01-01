# babel-plugin-styled-components-px2rem

[![npm version](https://img.shields.io/npm/v/babel-plugin-styled-components-px2rem.svg?style=flat-square)](https://www.npmjs.com/package/babel-plugin-styled-components-px2rem) [![Build Status](https://api.travis-ci.org/xuyuanxiang/babel-plugin-styled-components-px2rem.svg)](https://travis-ci.org/xuyuanxiang/babel-plugin-styled-components-px2rem) [![Coverage Status](https://coveralls.io/repos/github/xuyuanxiang/babel-plugin-styled-components-px2rem/badge.svg)](https://coveralls.io/github/xuyuanxiang/babel-plugin-styled-components-px2rem)

[Babel](https://babeljs.io/) plugin for convert `px` to `rem` units of [styled-components](https://www.styled-components.com/)

## Usage

see [example](example)

## Configuration

`babel.config.js`:

```js
module.exports = {
  plugins: [['styled-components-px2rem', { rootValue: 100, unitPrecision: 5, minPixelValue: 2, multiplier: 1 }]],
};
```

or `.babelrc`:

```json
{
  "plugins": [
    ["styled-components-px2rem", { "rootValue": 100, "unitPrecision": 5, "minPixelValue": 2, "multiplier": 1 }]
  ]
}
```

## Companion with [babel-plugin-styled-components](https://github.com/styled-components/babel-plugin-styled-components#readme)

### It should put before [babel-plugin-styled-components](https://github.com/styled-components/babel-plugin-styled-components#readme)

```json
{
  "plugins": ["styled-components-px2rem", "styled-components"]
}
```

## Options

| name | type | required | default | description |
| :-- | :-: | :-: | :-- | --: |
| rootValue | number | false | 100 | The root element font size |
| unitPrecision | number | false | 5 | The decimal numbers to allow the REM units to grow to |
| minPixelValue | number | false | 2 | Set the minimum pixel value to replace |
| multiplier | number | false | 1 | The multiplier of input value |
| tags | string[] | false | ["styled", "css", "createGlobalStyle", "keyframes"] | [styled-components](https://www.styled-components.com/) template literal [tagged](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) |

Simple version of the formula：

```js
const input = '32px'; // the value in css text
const pixels = parseFloat(input);

if (pixels < minPixelValue) {
  return input;
}

const fixedVal = toFixed((pixels * multiplier) / rootValue, unitPrecision);

return `${fixedVal}rem`;
```

## TODO

### Should support embedded expressions in template strings

```typescript
import styled from 'styled-components';

const InlineButton = styled.button`
  display: inline;
  width: ${props => props.width}px;
  height: 48px;
  line-height: 48px;
`;
// transformed:
const TransformedInlineButton = styled.button`
  display: inline;
  width: ${props => props.width}px; /* not work */
  height: 0.48rem;
  line-height: 0.48rem;
`;

const SizeableButton = styled.button(
  props => `
  display: inline;
  width: ${props.width}px;
  height: ${props.height}px;
  line-height: ${props.height}px;
  font-size: 16px;
`,
);
// transformed:
const TransformedSizeableButton = styled.button(
  props => `
  display: inline;
  width: ${props.width}px; /* not work */
  height: ${props.height}px; /* not work */
  line-height: ${props.height}px; /* not work */
  font-size: 0.16rem; 
`,
);
```
