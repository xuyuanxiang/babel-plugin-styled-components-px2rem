import { px2rem } from '../px2rem';

type Fn = (props: { width: number }) => void;

describe('px2rem()', () => {
  it('should work', function() {
    expect(px2rem('32px')).toBe('0.32rem');
    expect(px2rem(16)).toBe('0.16rem');
    expect(px2rem(null)).toBe('0px');
    expect(px2rem(undefined)).toBe('0px');
    expect(px2rem('px')).toBe('0px');
    const mock = (fn: Fn) => {
      const props = { width: 200 };
      return fn(props);
    };
    expect(
      mock(props =>
        px2rem(() => {
          return props.width / 2;
        }),
      ),
    ).toBe('1rem');
  });
});
