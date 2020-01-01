import configuration, { IConfiguration } from './configuration';

export function toFixed(value: number, precision: number): number {
  const multiplier = Math.pow(10, precision + 1);
  const wholeNumber = Math.floor(value * multiplier);
  return (Math.round(wholeNumber / 10) * 10) / multiplier;
}

export const px2rem = (
  input: unknown,
  {
    rootValue = configuration.config.rootValue,
    unitPrecision = configuration.config.unitPrecision,
    minPixelValue = configuration.config.minPixelValue,
    multiplier = configuration.config.multiplier,
  }: Partial<IConfiguration> = configuration.config,
): string => {
  if (typeof input === 'function') {
    return px2rem(input(), { rootValue, unitPrecision, minPixelValue, multiplier });
  }
  const value = typeof input === 'string' ? parseFloat(input) : typeof input === 'number' ? input : 0;
  const pixels = Number.isNaN(value) ? 0 : value;
  if (pixels < minPixelValue) {
    return `${pixels}px`;
  }
  const fixedVal = toFixed((pixels * multiplier) / rootValue, unitPrecision);

  return `${fixedVal}rem`;
};
