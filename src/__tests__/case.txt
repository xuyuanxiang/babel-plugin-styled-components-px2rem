import styled, { css, createGlobalStyle, keyframes } from 'styled-components';

const mixins = css`
  padding: 0 16px;
  margin: 16px 32px 16px 32px;
`;

const Animation = keyframes`
  from {
    transform: translateX(100px);
  }

  to {
    transform: translateX(-100px);
  }
`;

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

const ExtendedButton = styled(InlineButton)`
  width: 120px;
  height: 32px;
  line-height: 32px;
  font-size: 14px;
`;

const SizeableButton = styled.button(
  props => `
  display: inline;
  width: ${props.width}px;
  height: ${props.height};
  font-size: 16px;
`,
);
