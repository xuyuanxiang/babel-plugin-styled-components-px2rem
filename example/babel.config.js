module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    ['styled-components-px2rem', { rootValue: 100, unitPrecision: 5, minPixelValue: 2, multiplier: 1, transformRuntime: true }],
  ],
};
