import { transformFileSync } from '@babel/core';
import { join } from 'path';
import plugin from '../';

describe('e2e', () => {
  it('should work', function() {
    const result = transformFileSync(join(__dirname, 'case.txt'), { plugins: [plugin] });
    if (result && result.code) {
      expect(result.code).toMatchSnapshot();
    } else {
      throw new Error('Should transform code');
    }
  });
});
