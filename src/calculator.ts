import * as R from 'ramda';

interface OpCodeData {
  parsed: boolean;
  opCode: string;
  stack: number[];
}

type Operation = (data: OpCodeData) => OpCodeData;
type OpImplementation = (data: number[]) => number;

export function calculate(input: string): number {
  return R.pipe(
    tokenize,
    R.reduce<string, number[]>(parseStack, []),
    getResultFromCalculationStack
  )(input);
}

function tokenize(input: string): string[] {
  return input
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ');
}

function parseStack(stack: number[], token: string): number[] {
  if (isNumber(token)) {
    return stack.concat(Number(token));
  } else {
    return performOperationOnStack(stack, token);
  }
}

function isNumber(token: string): boolean {
  return !Number.isNaN(Number(token));
}

function performOperationOnStack(stack: number[], opCode: string): number[] {
  return R.pipe(
    validOperation('+', 2, addImplementation),
    validOperation('-', 2, subImplementation),
    validOperation('*', 2, mulImplementation),
    invalidOperation()
  )(newOpCodeData(stack, opCode)).stack;
}

function validOperation(
  opSymbol: string,
  numberOfArguments: number,
  opImplementation: OpImplementation
): Operation {
  return (data: OpCodeData): OpCodeData => {
    if (data.parsed || data.opCode !== opSymbol) {
      return data;
    }
    if (data.stack.length < numberOfArguments) {
      throw new SyntaxError('Insufficient number of arguments');
    }

    const { opArguments, remainingArguments } = extractArgs(
      data.stack,
      numberOfArguments
    );
    const operationResult = opImplementation(opArguments);

    return opParsed(data, remainingArguments, operationResult);
  };
}

function invalidOperation(): Operation {
  return (input: OpCodeData): OpCodeData => {
    if (input.parsed) {
      return input;
    }

    throw new SyntaxError('Invalid operation: ' + input.opCode);
  };
}

function newOpCodeData(stack: number[], opCode: string): OpCodeData {
  return {
    opCode,
    parsed: false,
    stack
  };
}

function extractArgs(stack: number[], numberOfArguments: number) {
  const slicedStack = R.splitAt<number>(
    stack.length - numberOfArguments,
    stack
  );

  return { opArguments: slicedStack[1], remainingArguments: slicedStack[0] };
}

function opParsed(
  data: OpCodeData,
  remainingArgs: number[],
  opResult: number
): OpCodeData {
  const newStack = appendResult(remainingArgs, opResult);
  return { parsed: true, opCode: data.opCode, stack: newStack };
}

function appendResult(stack: number[], result: number) {
  return stack.concat(result);
}

function addImplementation(data: number[]): number {
  return R.sum(data);
}

function subImplementation(data: number[]): number {
  return data[0] - data[1];
}

function mulImplementation(data: number[]): number {
  return data[0] * data[1];
}

function getResultFromCalculationStack(stack: number[]): number {
  if (stack.length !== 1) {
    throw new SyntaxError('Insufficient number of operations');
  }

  return stack[0];
}
