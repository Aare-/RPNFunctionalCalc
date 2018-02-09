import * as R from 'ramda';

export function calculate(input: string): number {
  return R.reduce<number, number>(R.add, 0, prepareInput(input));
}

function prepareInput(input: string): number[] {
  return R.map(toNumber, tokenize(input));
}

function toNumber(value: string): number {
  return Number(value);
}

function tokenize(input: string): string[] {
  return input.split(' ');
}
