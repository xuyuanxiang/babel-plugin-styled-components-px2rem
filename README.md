# babel-plugin-styled-components-px2rem

[![npm version](https://img.shields.io/npm/v/babel-plugin-styled-components-px2rem.svg?style=flat-square)](https://www.npmjs.com/package/babel-plugin-styled-components-px2rem) 
[![Build Status](https://api.travis-ci.org/xuyuanxiang/babel-plugin-styled-components-px2rem.svg)](https://travis-ci.org/xuyuanxiang/babel-plugin-styled-components-px2rem) 
[![codecov](https://codecov.io/gh/xuyuanxiang/babel-plugin-styled-components-px2rem/branch/master/graph/badge.svg)](https://codecov.io/gh/xuyuanxiang/babel-plugin-styled-components-px2rem)

[Babel](https://babeljs.io/) plugin for convert `px` to `rem` units of [styled-components](https://www.styled-components.com/)

1. Use [postcss-plugin-px2rem](https://github.com/pigcan/postcss-plugin-px2rem#readme) to process all css text in template strings.

2. Add a runtime `px2rem` function polyfill to process expression embedded in template strings when enable [transformRuntime](#transform-runtime) option.

TypeScript transformer with similar functionality：[typescript-styled-components-px2rem](https://github.com/xuyuanxiang/typescript-styled-components-px2rem).

## Table of Contents

- [Requirement](#requirement)
- [Usage](#usage)
- [Configuration](#configuration)
- [Composition](#composition)
- [Options](#options)
- [Transform Runtime](#transform-runtime)
  * [FunctionExpression](#functionexpression)
  * [ArrowFunctionExpression](#arrowfunctionexpression)
  * [MemberExpression](#memberexpression)
  * [ConditionalExpression](#conditionalexpression)
  * [Other Expressions](#other-expressions)

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
      { rootValue: 100, unitPrecision: 5, minPixelValue: 0, multiplier: 1, transformRuntime: false },
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
      { "rootValue": 100, "unitPrecision": 5, "minPixelValue": 0, "multiplier": 1, "transformRuntime": false }
    ]
  ]
}
```

## Composition

It should be put before [babel-plugin-styled-components](https://github.com/styled-components/babel-plugin-styled-components#readme)

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
| minPixelValue | number | false | 0 | Set the minimum pixel value to replace |
| multiplier | number | false | 1 | The multiplier of input value |
| tags | string[] | false | ["styled", "css", "createGlobalStyle", "keyframes"] | [styled-components](https://www.styled-components.com/) template literal [tagged](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) |
| transformRuntime | boolean | false | false | since 1.1.0，enable transformation of all expressions that embedded in template strings |

Simple version of the formula：

```js
const input = '32px'; // the value in css text
const pixels = parseFloat(input);

if (Math.abs(pixels) < minPixelValue) {
  return input;
}

const fixedVal = toFixed((pixels * multiplier) / rootValue, unitPrecision);

return `${fixedVal}rem`;
```

Remaining options are consistent with [postcss-plugin-px2rem](https://github.com/pigcan/postcss-plugin-px2rem#readme).

## Transform Runtime

If enabled `transformRuntime` option, all supported expressions embedded in template strings are processed as follows:

**Note:** Only expression that end with `px` will be processed.

### FunctionExpression

source code:

```javascript
import styled from 'styled-components';

export const FunctionExpression = styled.button`
  height: ${function(props) {
    return props.height;
  }}px;
`;
```

compiled:

```javascript
import styled from 'styled-components';

export const FunctionExpression = styled.button`
  height: ${(...args) =>
    _px2rem(function(props) {
      return props.height;
    }, ...args)};
`;

function _px2rem(input, ...args) {
  if (typeof input === 'function') return _px2rem(input(...args), ...args);
  var value = typeof input === 'string' ? parseFloat(input) : typeof input === 'number' ? input : 0;
  var pixels = Number.isNaN(value) ? 0 : value;
  if (Math.abs(pixels) < 0) return pixels + 'px';
  var mul = Math.pow(10, 5 + 1);
  return Math.round(Math.floor(pixels * 1 / 100 * mul) / 10) * 10 / mul + 'rem';
}
```

### ArrowFunctionExpression

source code:

```javascript
import styled from 'styled-components';

const height = '44';
export const ArrowFunction = styled.input.attrs(props => ({
  type: 'password',
  size: props.size || '16px',
  width: props.width || 100,
}))`
  color: palevioletred;
  font-size: 14px;
  border: 1px solid palevioletred;
  border-radius: 8px;
  width: ${props => props.width}px; /* MemberExpression Body */
  height: ${() => height}px; /* Identifier Body */
  line-height: ${() => '44'}px; /* StringLiteral Body */
  margin: ${() => 32}px; /* NumericLiteral Body */
  padding: ${props => props.size};
`;

export const ArrowFunctionWithBlockBody = styled.button`
  width: ${props => {
    if (props.width) {
      return props.width;
    } else {
      return 0;
    }
  }}px; /* Block Body */

  ${props => (props.disabled ? 'height: 400px' : 'height: 200px')};
`;

export const ArrowFunctionWithBinaryBody = styled.button`
  ${props =>
    props.disabled &&
    `
    width: 200px;
    font-size: 14px;
  `};
  height: ${props => !props.disabled && props.height}px; /* LogicalExpression Body */
  width: ${() => 44 + 50}px; /* BinaryExpression Body */
`;

export const ArrowFunctionWithConditionalBody = styled.button`
  height: ${props => (props.height ? height : 100)}px; /* ConditionalExpression Body */
`;
```

compiled:

```javascript
import styled from 'styled-components';

const height = '44';
export const ArrowFunction = styled.input.attrs(props => ({
  type: 'password',
  size: props.size || '0.16rem',
  width: props.width || 100,
}))`
  color: palevioletred;
  font-size: 0.14rem;
  border: 1px solid palevioletred;
  border-radius: 0.08rem;
  width: ${props => _px2rem(props.width)}; /* PropertyAccess Body */
  height: ${() => _px2rem(height)}; /* Identifier Body */
  line-height: ${() => _px2rem('44')}; /* StringLiteral Body */
  margin: ${() => _px2rem(32)}; /* NumericLiteral Body */
  padding: ${props => props.size};
`;

export const ArrowFunctionWithBlockBody = styled.button`
  width: ${props =>
    _px2rem(() => {
      if (props.width) {
        return props.width;
      } else {
        return 0;
      }
    })}; /* Block Body */

  ${props => (props.disabled ? 'height: 4rem' : 'height: 2rem')};
`;

export const ArrowFunctionWithBinaryBody = styled.button`
  ${props =>
    props.disabled &&
    `
    width: 2rem;
    font-size: 0.14rem;
  `};
  height: ${props => _px2rem(!props.disabled && props.height)}; /* ArrowFunction with a LogicalExpression Body */
  width: ${() => _px2rem(44 + 50)}; /* ArrowFunction with a BinaryExpression Body */
`;

export const ArrowFunctionWithConditionalBody = styled.button`
  height: ${props =>
    props.height ? _px2rem(height) : _px2rem(100)}; /* ArrowFunction with a ConditionalExpression Body */
`;

function _px2rem(input, ...args) {
  if (typeof input === 'function') return _px2rem(input(...args), ...args);
  var value = typeof input === 'string' ? parseFloat(input) : typeof input === 'number' ? input : 0;
  var pixels = Number.isNaN(value) ? 0 : value;
  if (Math.abs(pixels) < 0) return pixels + 'px';
  var mul = Math.pow(10, 5 + 1);
  return Math.round(Math.floor(pixels * 1 / 100 * mul) / 10) * 10 / mul + 'rem';
}
```

### MemberExpression

source code:

```javascript
import styled from 'styled-components';

export const MemberExpression = styled.button(
  props => `
  display: inline;
  width: ${props.width}px;
  height: ${props.height}; /* Note: Only expression end with 'px' will be processed. */
  font-size: 16px;
`,
);

```

compiled:

```javascript
import styled from 'styled-components';

export const MemberExpression = styled.button(props => `
  display: inline;
  width: ${_px2rem(props.width)};
  height: ${props.height}; /* Note: Only expression end with 'px' will be processed. */
  font-size: 0.16rem;
`);

function _px2rem(input, ...args) {
  if (typeof input === 'function') return _px2rem(input(...args), ...args);
  var value = typeof input === 'string' ? parseFloat(input) : typeof input === 'number' ? input : 0;
  var pixels = Number.isNaN(value) ? 0 : value;
  if (Math.abs(pixels) < 0) return pixels + 'px';
  var mul = Math.pow(10, 5 + 1);
  return Math.round(Math.floor(pixels * 1 / 100 * mul) / 10) * 10 / mul + 'rem';
}
```

### ConditionalExpression

source code:

```jsx harmony
import React from 'react';
import styled from 'styled-components';

export const ConditionalExpression = function({ fontSize } = {}) {
  const StyledButton = styled.button`
    font-size: ${typeof fontSize === 'number' ? fontSize : props => props.theme.fontSize}px;
  `;

  return <StyledButton />;
};
export const ConditionalExpressionWhenTrue = function({ fontSize } = {}) {
  const StyledButton = styled.button`
    font-size: ${typeof fontSize !== 'number' ? props => props.theme.fontSize : fontSize}px;
  `;

  return <StyledButton />;
};
export const ConditionalExpressionWhenFalse = function({ fontSize } = {}) {
  const StyledButton = styled.button`
    font-size: ${typeof fontSize === 'number' ? fontSize : 16}px;
  `;

  return <StyledButton />;
};
```

compiled:

```javascript
import React from 'react';
import styled from 'styled-components';

export const ConditionalExpression = function ({
  fontSize
} = {}) {
  const StyledButton = styled.button`
    font-size: ${typeof fontSize === 'number' ? _px2rem(fontSize) : props => _px2rem(props.theme.fontSize)};
  `;
  return React.createElement(StyledButton, null);
};
export const ConditionalExpressionWhenTrue = function ({
  fontSize
} = {}) {
  const StyledButton = styled.button`
    font-size: ${typeof fontSize !== 'number' ? props => _px2rem(props.theme.fontSize) : _px2rem(fontSize)};
  `;
  return React.createElement(StyledButton, null);
};
export const ConditionalExpressionWhenFalse = function ({
  fontSize
} = {}) {
  const StyledButton = styled.button`
    font-size: ${typeof fontSize === 'number' ? _px2rem(fontSize) : _px2rem(16)};
  `;
  return React.createElement(StyledButton, null);
};

function _px2rem(input, ...args) {
  if (typeof input === 'function') return _px2rem(input(...args), ...args);
  var value = typeof input === 'string' ? parseFloat(input) : typeof input === 'number' ? input : 0;
  var pixels = Number.isNaN(value) ? 0 : value;
  if (Math.abs(pixels) < 0) return pixels + 'px';
  var mul = Math.pow(10, 5 + 1);
  return Math.round(Math.floor(pixels * 1 / 100 * mul) / 10) * 10 / mul + 'rem';
}
```

### Other Expressions

Identifier, CallExpression, BinaryExpress, StringLiteral, NumericLiteral, MemberExpression, LogicalExpression...

source code:

```javascript
import styled, { css, createGlobalStyle } from 'styled-components';

const fontSize = 18;
function getHeight() {
  const height = 100;

  return height / 2;
}
const mixins = css`
  padding: 0 16px;
  margin: 16px 32px 16px 32px;
`;
export const GlobalStyle = createGlobalStyle`
  html body {
    ${mixins};
    font-size: ${fontSize}px; /* Identifier */
    width: 1024px;
    height: ${getHeight()}px; /* CallExpression */
  }
`;

const condition = false;
function calc() {
  return 20;
}
export const BinaryAndLogicExpression = styled.button`
  ${condition ||
`
    width: 200px;
  `};
  height: ${condition || 100}px; /* LogicExpression */
  padding: ${40 + 50}px 8px ${4}px 16px; /* BinaryExpression */
  line-height: ${calc() - 2}px; /* BinaryExpression */
`;
```

compiled:

```javascript
import styled, { css, createGlobalStyle } from 'styled-components';

const fontSize = 18;

function getHeight() {
  const height = 100;
  return height / 2;
}

const mixins = css`
  padding: 0 0.16rem;
  margin: 0.16rem 0.32rem 0.16rem 0.32rem;
`;
export const GlobalStyle = createGlobalStyle`
  html body {
    ${mixins};
    font-size: ${_px2rem(fontSize)}; /* Identifier */
    width: 10.24rem;
    height: ${_px2rem(getHeight())}; /* CallExpression */
  }
`;

const condition = false;

function calc() {
  return 20;
}

export const BinaryAndLogicExpression = styled.button`
  ${condition || `
    width: 2rem;
  `};
  height: ${_px2rem(condition || 100)};
  padding: ${_px2rem(40 + 50)} 0.08rem ${_px2rem(4)} 0.16rem;
  line-height: ${_px2rem(calc() - 2)};
`;

function _px2rem(input, ...args) {
  if (typeof input === 'function') return _px2rem(input(...args), ...args);
  var value = typeof input === 'string' ? parseFloat(input) : typeof input === 'number' ? input : 0;
  var pixels = Number.isNaN(value) ? 0 : value;
  if (Math.abs(pixels) < 0) return pixels + 'px';
  var mul = Math.pow(10, 5 + 1);
  return Math.round(Math.floor(pixels * 1 / 100 * mul) / 10) * 10 / mul + 'rem';
}
```
