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

The use of React and styled-components [test cases](example/src/__tests__/index.spec.jsx).

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

```jsx harmony
import React from 'react';
import styled, { css, createGlobalStyle, keyframes } from 'styled-components';

const Animation = keyframes`
  from {
    transform: translateX(100px);
  }

  to {
    transform: translateX(-100px);
  }
`;

export const ArrowFunctionExpression = styled.input.attrs(props => ({
  type: 'password',
  size: props.size || '16px',
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
export const GlobalStyle = createGlobalStyle`
  html body {
    font-size: ${fontSize}px;
    width: 1024px;
    min-height: 800px;
  }
`;

function getHeight() {
  const height = 100;

  return height / 2;
}
const mixins = css`
  padding: 0 16px;
  margin: 16px 32px 16px 32px;
`;
export const MixinsButton = styled.button`
  ${mixins};
  display: block;
  width: 100%;
  height: ${getHeight()}px;
  line-height: 32px;
`;

const lineHeight = '44';
export const ArrowFunctionExpressionWithBlockBody = styled.button`
  width: ${props => {
    if (props.width) {
      return props.width;
    } else {
      return 0;
    }
  }}px;
  line-height: ${lineHeight}px;
`;

export const StyledButton = styled.button`
  width: 120px;
  height: 32px;
  font-size: 14px;
`;

export const ExtendStyledButton = styled(StyledButton)`
  padding: ${props => props.padding}px;
`;

export const PropertyAccessExpression = styled.button(
  props => `
  display: inline;
  width: ${props.width}px;
  height: ${props.height};
  font-size: 16px;
`,
);

export const ThemeConsumer = styled.div`
  font-size: ${props => props.theme.fontSize}px;
  color: ${props => props.theme.color};
`;

export const ConditionalExpression = function({ fontSize } = {}) {
  const StyledButton = styled.button`
    font-size: ${typeof fontSize === 'number' ? fontSize : props => props?.theme.fontSize}px;
  `;

  return <StyledButton />;
};

```

will be transformed to:

```javascript
import React from 'react';
import styled, { css, createGlobalStyle, keyframes } from 'styled-components';
const Animation = keyframes`
  from {
    transform: translateX(1rem);
  }

  to {
    transform: translateX(-1rem);
  }
`;
export const ArrowFunctionExpression = styled.input.attrs(props => ({
  type: 'password',
  size: props.size || '16px',
  width: props.width || 100
}))`
  color: palevioletred;
  font-size: 0.14rem;
  border: 1px solid palevioletred;
  border-radius: 0.08rem;
  width: ${props => _px2rem(props.width)};
  padding: ${props => props.size};
`;
const fontSize = 18;
export const GlobalStyle = createGlobalStyle`
  html body {
    font-size: ${_px2rem(fontSize)};
    width: 10.24rem;
    min-height: 8rem;
  }
`;

function getHeight() {
  const height = 100;
  return height / 2;
}

const mixins = css`
  padding: 0 0.16rem;
  margin: 0.16rem 0.32rem 0.16rem 0.32rem;
`;
export const MixinsButton = styled.button`
  ${mixins};
  display: block;
  width: 100%;
  height: ${_px2rem(getHeight())};
  line-height: 0.32rem;
`;
const lineHeight = '44';
export const ArrowFunctionExpressionWithBlockBody = styled.button`
  width: ${props => _px2rem(() => {
  if (props.width) {
    return props.width;
  } else {
    return 0;
  }
})};
  line-height: ${_px2rem(lineHeight)};
`;
export const StyledButton = styled.button`
  width: 1.2rem;
  height: 0.32rem;
  font-size: 0.14rem;
`;
export const ExtendStyledButton = styled(StyledButton)`
  padding: ${props => _px2rem(props.padding)};
`;
export const PropertyAccessExpression = styled.button(props => `
  display: inline;
  width: ${_px2rem(props.width)};
  height: ${props.height};
  font-size: 0.16rem;
`);
export const ThemeConsumer = styled.div`
  font-size: ${props => _px2rem(props.theme.fontSize)};
  color: ${props => props.theme.color};
`;
export const ConditionalExpression = function ({
  fontSize
} = {}) {
  const StyledButton = styled.button`
    font-size: ${typeof fontSize === 'number' ? _px2rem(fontSize) : props => _px2rem(props === null || props === void 0 ? void 0 : props.theme.fontSize)};
  `;
  return React.createElement(StyledButton, null);
};

function _px2rem(input) {
  if (typeof input === 'function') return _px2rem(input());
  var value = typeof input === 'string' ? parseFloat(input) : typeof input === 'number' ? input : 0;
  var pixels = Number.isNaN(value) ? 0 : value;

  if (pixels < 2) {
    return `${pixels}px`;
  }

  var mul = Math.pow(10, 5 + 1);
  return `${Math.round(Math.floor(pixels * 1 / 100 * mul) / 10) * 10 / mul}rem`;
}

```

**Note:** Only expressions that end in `px` will be processed.


### Current Supported Expression

#### PropertyAccessExpression

```javascript
import styled from 'styled-components';

export const PropertyAccessExpression = styled.button(
  props => `
  display: inline;
  width: ${props.width}px;
  height: ${props.height};
  font-size: 16px;
`,
);
```

#### ArrowFunctionExpression

```javascript
import styled from 'styled-components';

export const ArrowFunctionExpression = styled.input.attrs(props => ({
  type: 'password',
  size: props.size || '16px',
  width: props.width || 100,
}))`
  color: palevioletred;
  font-size: 14px;
  border: 1px solid palevioletred;
  border-radius: 8px;
  width: ${props => props.width}px;
  padding: ${props => props.size};
`;
const lineHeight = '44';
export const ArrowFunctionExpressionWithBlockBody = styled.button`
  width: ${props => {
    if (props.width) {
      return props.width;
    } else {
      return 0;
    }
  }}px;
  line-height: ${lineHeight}px;
`;
```

#### ConditionalExpression

```jsx harmony
import React from 'react';
import styled from 'styled-components';

export const ConditionalExpression = function({ fontSize } = {}) {
  const StyledButton = styled.button`
    font-size: ${typeof fontSize === 'number' ? fontSize : props => props?.theme.fontSize}px;
  `;

  return <StyledButton />;
};
```

#### Other Expressions

Identifier, CallExpression...

```javascript
import styled, { createGlobalStyle } from 'styled-components';

const fontSize = 18;
export const GlobalStyle = createGlobalStyle`
  html body {
    font-size: ${fontSize}px;
    width: 1024px;
    min-height: 800px;
  }
`;

function getHeight() {
  const height = 100;

  return height / 2;
}
export const MixinsButton = styled.button`
  display: block;
  width: 100%;
  height: ${getHeight()}px;
  line-height: 32px;
`;
```
