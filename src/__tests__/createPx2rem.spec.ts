import { identifier } from '@babel/types';
import generate from '@babel/generator';
import { runInNewContext } from 'vm';
import createPx2rem from '../createPx2rem';
import configuration, { IConfiguration } from '../configuration';

function px2rem(
  value: string,
  {
    rootValue = configuration.config.rootValue,
    unitPrecision = configuration.config.unitPrecision,
    multiplier = configuration.config.multiplier,
    minPixelValue = configuration.config.minPixelValue,
  }: Partial<IConfiguration> = configuration.config,
): string {
  const sandbox = { result: '' };
  const ast = createPx2rem(identifier('px2rem'), { rootValue, unitPrecision, multiplier, minPixelValue });
  const code = generate(ast).code;
  runInNewContext(`${code} result = px2rem(${value});`, sandbox);
  return sandbox.result;
}

it('should match snapshot', function() {
  const ast = createPx2rem(identifier('px2rem'), configuration.config);
  expect(generate(ast).code).toMatchSnapshot();
});

it('should transform String', function() {
  expect(px2rem("'-100px'")).toBe('-1rem');
  expect(px2rem("'32px'")).toBe('0.32rem');
  expect(px2rem("'11.3333333px'")).toBe('0.11333rem');
  expect(px2rem("'-11.3333333px'")).toBe('-0.11333rem');
});

it('should transform Number', function() {
  expect(px2rem('16')).toBe('0.16rem');
  expect(px2rem('16.3333333')).toBe('0.16333rem');
  expect(px2rem('-16')).toBe('-0.16rem');
  expect(px2rem('-16.3333333')).toBe('-0.16333rem');
});

it('should transform Function', function() {
  expect(px2rem('function() {return 20;}')).toBe('0.2rem');
  expect(px2rem('function(props) { return props.width / 2; }, { width: 100 }')).toBe('0.5rem');
});

it('should ignore value less than "minPixelValue" option', function() {
  const options = { minPixelValue: 2 };
  expect(px2rem("'1px'", options)).toBe('1px');
  expect(px2rem('1', options)).toBe('1px');
  expect(px2rem("'1.3333333px'", options)).toBe('1.3333333px');
  expect(px2rem('1.3333333', options)).toBe('1.3333333px');
  expect(px2rem("'-1px'", options)).toBe('-1px');
  expect(px2rem('-1', options)).toBe('-1px');
  expect(px2rem("'-1.3333333px'", options)).toBe('-1.3333333px');
  expect(px2rem('-1.3333333', options)).toBe('-1.3333333px');
  expect(px2rem('function() {return 1;}', options)).toBe('1px');
  expect(px2rem('function() {return "1px";}', options)).toBe('1px');
  expect(px2rem('function(props) { return props.width / 2; }, { width: 2 }', options)).toBe('1px');
  expect(px2rem('function(props) { return props.width / 2 + "px"; }, { width: 2 }', options)).toBe('1px');
});

it('should multiply "multiplier" option', function() {
  const options = { minPixelValue: 2, multiplier: 2 };
  expect(px2rem("'1px'", options)).toBe('1px');
  expect(px2rem('1', options)).toBe('1px');
  expect(px2rem("'1.3333333px'", options)).toBe('1.3333333px');
  expect(px2rem('1.3333333', options)).toBe('1.3333333px');
  expect(px2rem("'-1px'", options)).toBe('-1px');
  expect(px2rem('-1', options)).toBe('-1px');
  expect(px2rem("'-1.3333333px'", options)).toBe('-1.3333333px');
  expect(px2rem('-1.3333333', options)).toBe('-1.3333333px');
  expect(px2rem('function() {return 1;}', options)).toBe('1px');
  expect(px2rem('function() {return "1px";}', options)).toBe('1px');
  expect(px2rem('function(props) { return props.width / 2; }, { width: 2 }', options)).toBe('1px');
  expect(px2rem('function(props) { return props.width / 2 + "px"; }, { width: 2 }', options)).toBe('1px');
  expect(px2rem("'2px'", options)).toBe('0.04rem');
  expect(px2rem('2', options)).toBe('0.04rem');
  expect(px2rem("'2.3333333px'", options)).toBe('0.04667rem');
  expect(px2rem("'-2.3333333px'", options)).toBe('-0.04667rem');
  expect(px2rem('2.3333333', options)).toBe('0.04667rem');
  expect(px2rem('-2.3333333', options)).toBe('-0.04667rem');
  expect(px2rem("'-2px'", options)).toBe('-0.04rem');
  expect(px2rem('-2', options)).toBe('-0.04rem');
  expect(px2rem('function() {return 2;}', options)).toBe('0.04rem');
  expect(px2rem('function() {return "2px";}', options)).toBe('0.04rem');
  expect(px2rem('function(props) { return props.width / 2; }, { width: 4 }', options)).toBe('0.04rem');
  expect(px2rem('function(props) { return props.width / 2 + "px"; }, { width: 4 }', options)).toBe('0.04rem');
});
