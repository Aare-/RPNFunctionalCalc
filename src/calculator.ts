import * as R from 'ramda';

interface ParsedToken {
  op: string;
  num: number;
}

interface Result {
  success: boolean;
  stack: number[];
}

type OpResult = [ParsedToken, Result];
type OpImplementation = (data: number[]) => number;
type Operation = (tokenAndResult: OpResult) => OpResult;

export function calculate(input: string): number {
  return R.pipe(
    prepareInput,
    R.reduce<ParsedToken, number[]>(parseStack, []),
    getResultFromCalculationStack
  )(input);
}

function parseStack(stack: number[], token: ParsedToken): number[] {
  if (isNumber(token)) {
    return stack.concat(token.num);
  } else {
    return performOperationOnStack(stack, token);
  }
}

function performOperationOnStack(
  stack: number[],
  token: ParsedToken
): number[] {
  let result: Result = {
    success: false,
    stack: stack
  };

  return R.pipe(
    defineOperation('+', 2, addOperation),
    defineOperation('-', 2, subOperation),
    defineOperation('*', 2, mulOperation),
    invalidOperation()
  )([token, result])[1].stack;
}

function addOperation(data: number[]): number {
  return R.sum(data);
}

function subOperation(data: number[]): number {
  return data[0] - data[1];
}

function mulOperation(data: number[]): number {
  return data[0] * data[1];
}

function defineOperation(
  opSymbol: String,
  numberOfArguments: number,
  opImplementation: OpImplementation
): Operation {
  return (tokenAndResult: OpResult): OpResult => {
    let token = tokenAndResult[0];
    let result = tokenAndResult[1];

    if (result.success || token.op != opSymbol) {
      return tokenAndResult;
    }
    if (result.stack.length < numberOfArguments) {
      throw new SyntaxError('Insufficient number of arguments');
    }

    const slicedStack = R.splitAt<number>(
      result.stack.length - numberOfArguments,
      result.stack
    );
    const remainingStack = slicedStack[0];
    const opArguments = slicedStack[1];
    const operationResult = opImplementation(opArguments);
    const resultStack = R.concat<number>(remainingStack, [operationResult]);

    return [token, { success: true, stack: resultStack }];
  };
}

function invalidOperation(): Operation {
  return (tokenAndResult: OpResult): OpResult => {
    let token = tokenAndResult[0];
    let result = tokenAndResult[1];

    if (result.success) return tokenAndResult;

    throw new SyntaxError('Invalid operation: ' + token.op);
  };
}

function getResultFromCalculationStack(stack: number[]): number {
  if (stack.length != 1) {
    throw new SyntaxError('Insufficient number of operations');
  }

  return R.sum(stack);
}

function prepareInput(input: string): ParsedToken[] {
  return R.map(parseToken, tokenize(input));
}

function parseToken(token: string): ParsedToken {
  return {
    num: Number(token),
    op: token
  };
}

function tokenize(input: string): string[] {
  return input
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ');
}

function isNumber(token: ParsedToken): boolean {
  return !isOperation(token);
}

function isOperation(token: ParsedToken): boolean {
  return Number.isNaN(token.num);
}
