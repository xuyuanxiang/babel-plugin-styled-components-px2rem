import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import styled from 'styled-components';

const div = document.createElement('div');

beforeEach(() => {
  document.body.appendChild(div);
});

afterEach(() => {
  ReactDOM.unmountComponentAtNode(div);
  document.body.removeChild(div);
});

it('test 1', () => {
  TestUtils.act(() => {
    ReactDOM.render(
      React.createElement(
        styled.div`
          & {
            position: relative;
          }

          & {
            footer {
              height: 80px;
              background: green;
            }

            header {
              height: 45px;
              background: yellow;
            }
          }
        `,
        { id: 'testId' },
      ),
      div,
    );
  });
  expect(document.documentElement.innerHTML).toMatchSnapshot();
});

it('test 2', () => {
  TestUtils.act(() => {
    ReactDOM.render(
      React.createElement(
        styled.div`
          & {
            position: relative;
          }

          & footer {
            height: 80px;
            background: green;
          }

          & header {
            height: 45px;
            background: yellow;
          }
        `,
        { id: 'testId' },
      ),
      div,
    );
  });
  expect(document.documentElement.innerHTML).toMatchSnapshot();
});

it('test 3', () => {
  TestUtils.act(() => {
    ReactDOM.render(
      React.createElement(
        styled.div`
          & footer {
            height: 80px;
            background: green;
          }

          & header {
            height: 45px;
            background: yellow;
          }
        `,
        { id: 'testId' },
      ),
      div,
    );
  });
  expect(document.documentElement.innerHTML).toMatchSnapshot();
});
