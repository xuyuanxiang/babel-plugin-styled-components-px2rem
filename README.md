# babel-plugin-styled-components-px2rem

[![npm version](https://img.shields.io/npm/v/babel-plugin-styled-components-px2rem.svg?style=flat-square)](https://www.npmjs.com/package/babel-plugin-styled-components-px2rem) [![Build Status](https://api.travis-ci.org/xuyuanxiang/babel-plugin-styled-components-px2rem.svg)](https://travis-ci.org/xuyuanxiang/babel-plugin-styled-components-px2rem) [![Coverage Status](https://coveralls.io/repos/github/xuyuanxiang/babel-plugin-styled-components-px2rem/badge.svg)](https://coveralls.io/github/xuyuanxiang/babel-plugin-styled-components-px2rem)

[Babel](https://babeljs.io/) plugin for convert `px` to `rem` units of [styled-components](https://www.styled-components.com/)

Use [postcss-plugin-px2rem](https://github.com/pigcan/postcss-plugin-px2rem#readme) to process all css text in template strings.

TypeScript transformer with similar functionality：[typescript-styled-components-px2rem](https://github.com/xuyuanxiang/typescript-styled-components-px2rem).

## Requirement

You need to install the following `peerDependencies` of babel-plugin-styled-components-px2rem into your project at the same time:

```json
{
  "peerDependencies": {
    "@babel/core": "^7.0.0",
    "postcss": "^7.0.0"
  }
}
```

## Usage

see [example](example)

## Configuration

`babel.config.js`:

```js
module.exports = {
  plugins: [
    [
      'styled-components-px2rem',
      { rootValue: 100, unitPrecision: 5, minPixelValue: 2, multiplier: 1, transformRuntime: false },
    ],
  ],
};
```

or `.babelrc`:

```json
{
  "plugins": [
    [
      "styled-components-px2rem",
      { "rootValue": 100, "unitPrecision": 5, "minPixelValue": 2, "multiplier": 1, "transformRuntime": false }
    ]
  ]
}
```

## Composition

It should put before [babel-plugin-styled-components](https://github.com/styled-components/babel-plugin-styled-components#readme)

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
| transformRuntime | boolean | false | false | since 1.1.0，enable transformation of all expressions that embedded in template strings |

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

Remaining options ara consistent with [postcss-plugin-px2rem](https://github.com/pigcan/postcss-plugin-px2rem#readme).

## Transform Runtime

If enabled `transformRuntime` option, all expressions embedded in template strings are processed as follows:

Source code:

```javascript
import styled, { createGlobalStyle } from 'styled-components';

const Input = styled.input.attrs(props => ({
  type: 'password',
  size: props.size || '1em',
  width: props.width || 100,
}))`
  color: palevioletred;
  font-size: 14px;
  border: 1px solid palevioletred;
  border-radius: 8px;
  width: ${props => props.width}px;
  padding: ${props => props.size};
`;

const fontSize = 18;
const GlobalStyle = createGlobalStyle`
  html body {
    font-size: ${fontSize}px;
  }
`;

function getHeight() {
  const height = 100;

  return height + window.screen.availHeight / 2;
}
const BlockButton = styled.button`
  ${mixins};
  display: block;
  width: 100%;
  height: ${getHeight()}px;
  line-height: 96px;
`;

const lineHeight = '44';
const InlineButton = styled.button`
  display: inline;
  width: ${props => {
    if (props.width) {
      return props.width;
    } else {
      return 0;
    }
  }}px;
  height: ${props.height}px;
  line-height: ${lineHeight}px;
`;

const SizeableButton = styled.button(
  props => `
  display: inline;
  width: ${props.width}px;
  height: ${props.height};
  font-size: 16px;
`,
);

```

will be transformed to:

```javascript
import { px2rem as _px2rem } from "babel-plugin-styled-components-px2rem/lib/px2rem";
var _OPTIONS = {
  rootValue: 100,
  unitPrecision: 5,
  multiplier: 1,
  minPixelValue: 2
};
import styled, { createGlobalStyle } from 'styled-components';

const Input = styled.input.attrs(props => ({
  type: 'password',
  size: props.size || '1em',
  width: props.width || 100
}))`
  color: palevioletred;
  font-size: 0.14rem;
  border: 1px solid palevioletred;
  border-radius: 0.08rem;
  width: ${props => _px2rem(props.width, _OPTIONS)};
  padding: ${props => props.size}; /* ignored, only expressions end with px will be processed. */
`;

const fontSize = 18;
const GlobalStyle = createGlobalStyle`
  html body {
    font-size: ${_px2rem(fontSize, _OPTIONS)};
  }
`;

function getHeight() {
  const height = 100;
  return height + window.screen.availHeight / 2;
}
const BlockButton = styled.button`
  display: block;
  width: 100%;
  height: ${_px2rem(getHeight(), _OPTIONS)};
  line-height: 0.96rem;
`;

const lineHeight = '44';
const InlineButton = styled.button`
  display: inline;
  width: ${props => _px2rem(() => {
  if (props.width) {
    return props.width;
  } else {
    return 0;
  }
})};
  height: ${_px2rem(props.height, _OPTIONS)};
  line-height: ${_px2rem(lineHeight, _OPTIONS)};
`;


const SizeableButton = styled.button(props => `
  display: inline;
  width: ${_px2rem(props.width, _OPTIONS)};
  height: ${props.height}; /* ignored, only expressions end with px will be processed. */
  font-size: 0.16rem;
`);

```

**Note:** Only expressions that end in `px` will be processed.
