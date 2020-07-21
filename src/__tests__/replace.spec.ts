import { replace } from '../replace';

describe('replace()', () => {
  it('should work', function() {
    expect(
      replace(
        '\n  display: block;\n  margin: 0 16px;\n  width: 200px;\n  height: 44px;\n  line-height: 44px;\n  border: 1px solid red;\n  border-radius:8px;\n  padding: 8px 16px 32px 40px;\n  font-size: 14px;\n  transform: translate(100px, 200px);\n',
      ),
    ).toBe(
      '\n  display: block;\n  margin: 0 0.16rem;\n  width: 2rem;\n  height: 0.44rem;\n  line-height: 0.44rem;\n  border: 0.01rem solid red;\n  border-radius:0.08rem;\n  padding: 0.08rem 0.16rem 0.32rem 0.4rem;\n  font-size: 0.14rem;\n  transform: translate(1rem, 2rem);\n',
    );
    expect(replace('\nhtml body {\n  font-size: 16px;\n}\n')).toBe('\nhtml body {\n  font-size: 0.16rem;\n}\n');
    expect(replace('\n  &:last-child {\n    border: none')).toBe('\n  &:last-child {\n    border: none');
    expect(replace('\n  /* test */ body {')).toBe('\n  /* test */ body {');
    expect(replace('18px 16px 32px 8px')).toBe('0.18rem 0.16rem 0.32rem 0.08rem');
    expect(replace('px 16px')).toBe('px 0.16rem');
    expect(replace('px; /* Identifier */\n width: 1024px;\n height: ')).toBe(
      'px; /* Identifier */\n width: 10.24rem;\n height: ',
    );
  });
  it('should support multi-level code blocks', () => {
    expect(
      replace(`
  & {
    footer {
      height: 80px;
      background: green;
    }

    header {
      height: 45px;
      background: yellow;
    }
  }`),
    ).toBe(`
  & {
    footer {
      height: 0.8rem;
      background: green;
    }

    header {
      height: 0.45rem;
      background: yellow;
    }
  }`);

    expect(
      replace(`
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
  }`),
    ).toBe(`
  & {
    position: relative;
  }

  & {
    footer {
      height: 0.8rem;
      background: green;
    }

    header {
      height: 0.45rem;
      background: yellow;
    }
  }`);

    expect(
      replace(`
  & footer {
    height: 80px;
    background: green;
  }

  & header {
    height: 45px;
    background: yellow;
  }`),
    ).toBe(`
  & footer {
    height: 0.8rem;
    background: green;
  }

  & header {
    height: 0.45rem;
    background: yellow;
  }`);
  });
});
