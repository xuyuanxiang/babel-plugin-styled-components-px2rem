import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import { ThemeProvider } from 'styled-components';
import {
  StyledButton,
  MemberExpression,
  FunctionExpression,
  ArrowFunctionWithBlockBody,
  ArrowFunctionWithBinaryBody,
  ArrowFunctionWithConditionalBody,
  GlobalStyle,
  ExtendStyledButton,
  ArrowFunction,
  ThemeConsumer,
  ConditionalExpression,
  BinaryAndLogicExpression,
} from '../index';

const div = document.createElement('div');

beforeEach(() => {
  document.body.appendChild(div);
});

afterEach(() => {
  ReactDOM.unmountComponentAtNode(div);
  document.body.removeChild(div);
});

it("should transform <ConditionalExpression/> with ThemeProvider's fontSize", function() {
  TestUtils.act(() => {
    ReactDOM.render(
      <ThemeProvider theme={{ fontSize: 48 }}>
        <ConditionalExpression spacing />
      </ThemeProvider>,
      div,
    );
  });
  const button = div.querySelector('button');
  if (button) {
    const style = getComputedStyle(button);
    expect(style.fontSize).toBe('0.48rem');
    expect(style.padding).toBe('0.08rem 0.16rem 0px 0.32rem');
    expect(style.margin).toBe('0.16rem 0px');
  } else {
    throw new Error('ConditionalExpression should be render');
  }
});

it('should transform <ConditionalExpression/> with self fontSize', function() {
  TestUtils.act(() => {
    ReactDOM.render(
      <ThemeProvider theme={{ fontSize: 48 }}>
        <ConditionalExpression fontSize={24} />
      </ThemeProvider>,
      div,
    );
  });
  const button = div.querySelector('button');
  if (button) {
    const style = getComputedStyle(button);
    expect(style.fontSize).toBe('0.24rem');
  } else {
    throw new Error('ConditionalExpression should be render');
  }
});

it('should transform <ArrowFunction/>', function() {
  TestUtils.act(() => {
    ReactDOM.render(<ArrowFunction id="inputId" width={320} />, div);
  });
  const input = div.querySelector('input#inputId');
  if (input) {
    const style = getComputedStyle(input);
    expect(style.color).toBe('palevioletred');
    expect(style.fontSize).toBe('0.14rem');
    expect(style.border).toBe('0.01rem solid palevioletred');
    expect(style.borderRadius).toBe('0.08rem');
    expect(style.width).toBe('3.2rem');
    expect(style.padding).toBe('0.16rem');
    expect(style.margin).toBe('0.32rem');
    expect(style.lineHeight).toBe('0.44rem');
    expect(style.height).toBe('0.44rem');
  } else {
    throw new Error('ArrowFunction should be render');
  }
});

it('should transform <FunctionExpression/>', function() {
  TestUtils.act(() => {
    ReactDOM.render(<FunctionExpression id="btnId" height={120} />, div);
  });
  const button = div.querySelector('button#btnId');
  if (button) {
    const style = getComputedStyle(button);
    expect(style.height).toBe('1.2rem');
  } else {
    throw new Error('FunctionExpression should be render');
  }
});

it('should transform <GlobalStyle/>', function() {
  TestUtils.act(() => {
    ReactDOM.render(
      <>
        <GlobalStyle />
      </>,
      div,
    );
  });
  const style = getComputedStyle(document.body);
  expect(style.padding).toBe('-0.01rem 0.16rem');
  expect(style.margin).toBe('0.16rem 0.32rem 0.16rem 0.32rem');
  expect(style.fontSize).toBe('0.18rem');
  expect(style.width).toBe('10.24rem');
  expect(style.height).toBe('0.5rem');
});

it('should transform <StyledButton/>', function() {
  TestUtils.act(() => {
    ReactDOM.render(<StyledButton id="btnId" />, div);
  });
  const button = div.querySelector('button#btnId');
  if (button) {
    const style = getComputedStyle(button);
    expect(style.fontSize).toBe('0.14rem');
    expect(style.height).toBe('0.32rem');
    expect(style.width).toBe('1.2rem');
  } else {
    throw new Error('StyledButton should be render');
  }
});

it('should transform <ExtendStyledButton/>', function() {
  TestUtils.act(() => {
    ReactDOM.render(<ExtendStyledButton id="btnId" padding={64} />, div);
  });
  const button = div.querySelector('button#btnId');
  if (button) {
    const style = getComputedStyle(button);
    expect(style.fontSize).toBe('0.14rem');
    expect(style.height).toBe('0.32rem');
    expect(style.width).toBe('1.2rem');
    expect(style.padding).toBe('0.64rem');
  } else {
    throw new Error('ExtendStyledButton should be render');
  }
});

it('should transform <ArrowFunctionWithBlockBody/>', function() {
  TestUtils.act(() => {
    ReactDOM.render(<ArrowFunctionWithBlockBody id="btnId" width="160" />, div);
  });
  const button = div.querySelector('button#btnId');
  if (button) {
    const style = getComputedStyle(button);
    expect(style.height).toBe('2rem');
    expect(style.width).toBe('1.6rem');
  } else {
    throw new Error('ArrowFunctionWithBlockBody should be render');
  }
});

it('should transform <ArrowFunctionWithBinaryBody/>', function() {
  TestUtils.act(() => {
    ReactDOM.render(<ArrowFunctionWithBinaryBody id="btnId" height={120} />, div);
  });
  const button = div.querySelector('button#btnId');
  if (button) {
    const style = getComputedStyle(button);
    expect(style.height).toBe('1.2rem');
  } else {
    throw new Error('ArrowFunctionWithBinaryBody should be render');
  }
});

it('should transform <ArrowFunctionWithConditionalBody/>', function() {
  TestUtils.act(() => {
    ReactDOM.render(<ArrowFunctionWithConditionalBody id="btnId" />, div);
  });
  const button = div.querySelector('button#btnId');
  if (button) {
    const style = getComputedStyle(button);
    expect(style.height).toBe('1rem');
  } else {
    throw new Error('ArrowFunctionWithConditionalBody should be render');
  }
});

it('should transform <PropertyAccessExpression/>', function() {
  TestUtils.act(() => {
    ReactDOM.render(<MemberExpression id="btnId" width={200} height="44px" />, div);
  });
  const button = div.querySelector('button#btnId');
  if (button) {
    const style = getComputedStyle(button);
    expect(style.display).toBe('inline');
    expect(style.fontSize).toBe('0.16rem');
    expect(style.height).toBe('44px');
    expect(style.width).toBe('2rem');
  } else {
    throw new Error('PropertyAccessExpression should be render');
  }
});

it('should transform <ThemeConsumer/>', function() {
  TestUtils.act(() => {
    ReactDOM.render(
      <ThemeProvider theme={{ fontSize: 18, color: '#000000' }}>
        <ThemeConsumer id="consumer" />
      </ThemeProvider>,
      div,
    );
  });
  const consumer = div.querySelector('div#consumer');
  if (consumer) {
    const style = getComputedStyle(consumer);
    expect(style.fontSize).toBe('0.18rem');
    expect(style.color).toBe('rgb(0, 0, 0)');
  } else {
    throw new Error('ThemeConsumer should be render');
  }
});

it('should transform <BinaryExpression/>', function() {
  TestUtils.act(() => {
    ReactDOM.render(<BinaryAndLogicExpression id="btnId" />, div);
  });
  const consumer = div.querySelector('button#btnId');
  if (consumer) {
    const style = getComputedStyle(consumer);
    expect(style.width).toBe('2rem');
    expect(style.height).toBe('1rem');
    expect(style.padding).toBe('0.9rem 0.18rem 0.04rem 0.12rem');
    expect(style.lineHeight).toBe('0.18rem');
  } else {
    throw new Error('BinaryExpression should be render');
  }
});
