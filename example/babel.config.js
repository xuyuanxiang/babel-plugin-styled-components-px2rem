module.exports = {
  presets: ['@babel/preset-react'],
  plugins: [
    [
      'styled-components-px2rem',
      { rootValue: 100, unitPrecision: 5, minPixelValue: 2, multiplier: 1, transformRuntime: true },
    ],
  ],
  env: {
    test: {
      presets: ['@babel/preset-env', '@babel/preset-react'],
    },
  },
};
