import { transformFileSync } from '@babel/core';
import { join } from 'path';
import plugin from '../';

describe('e2e', () => {
  it('should work', function() {
    const result = transformFileSync(join(__dirname, 'case.txt'), {
      plugins: [plugin],
      presets: ['@babel/preset-react'],
    });
    if (result && result.code) {
      expect(result.code).toMatchSnapshot();
    } else {
      throw new Error('Should transform code');
    }
  });
  it('should transform runtime', function() {
    const result = transformFileSync(join(__dirname, 'case.txt'), {
      presets: ['@babel/preset-react'],
      plugins: [[plugin, { transformRuntime: true }]],
    });
    if (result && result.code) {
      expect(result.code).toMatchSnapshot();
    } else {
      throw new Error('Should transform code');
    }
  });
  it('should support multi-level code blocks', () => {
    const result = transformFileSync(join(__dirname, 'issue3.txt'), {
      plugins: [plugin],
      presets: ['@babel/preset-react'],
    });
    if (result && result.code) {
      expect(result.code).toMatchSnapshot();
    } else {
      throw new Error('Should transform code');
    }
  });
});
