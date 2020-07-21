import { transformFileSync } from '@babel/core';
import { join } from 'path';
import plugin from '../';

describe('issue#3', () => {
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
