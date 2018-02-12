import { assert, expect } from 'chai';
import { calculate } from '../src/calculator';

context('#calculate', () => {
  describe('Input parsing', () => {
    it('should return 0 for empty data', () => {
      expect(calculate('')).to.eq(0);
    });

    it('should return single number', () => {
      expect(calculate('1')).to.eq(1);
    });

    it('should return single double digit number', () => {
      expect(calculate('22')).to.eq(22);
    });

    it('should throw when not a number entered', () => {
      expect(() => {
        calculate('test');
      }).to.throw('Invalid operation: test');
    });

    it('should throw when two numbers without operation are given', () => {
      expect(() => {
        calculate('1 1');
      }).to.throw('Insufficient number of operations');
    });

    it('should ignore excessive spaces', () => {
      expect(calculate('    1     ')).to.eq(1);
    });

    it('should properly parse negative values', () => {
      expect(calculate('-1')).to.eq(-1);
    });
  });

  describe('Addition', () => {
    it('should accept "+" as a valid parameter', () => {
      calculate('1 1 +');
    });

    it('should throw when not enough operations given', () => {
      expect(() => {
        calculate('1 +');
      }).to.throw('Insufficient number of arguments');
    });

    it('should throw when too many arguments given', () => {
      expect(() => {
        calculate('1 1 1 +');
      }).to.throw('Insufficient number of operations');
    });

    it('should properly add numbers', () => {
      expect(calculate('1 1 +')).to.eq(2);
    });

    it('should be commutative', () => {
      expect(calculate('2 1 +')).to.eq(calculate('1 2 +'));
    });

    it('should work on result of previous additions', () => {
      expect(calculate('1 1 3 + +')).to.eq(5);
    });

    it('should work when called two times', () => {
      expect(calculate('1 2 + 3 +')).to.eq(6);
    });

    it('should work on big numbers', () => {
      expect(calculate('9999999999 9999999999 +')).to.eq(19999999998);
    });

    it('should properly work on negative values', () => {
      expect(calculate('-2 -3 +')).to.eq(-5);
    });
  });

  describe('Substraction', () => {
    it('should accept "-" as a valid parameter', () => {
      calculate('1 1 -');
    });

    it('should throw when not enough operations given', () => {
      expect(() => {
        calculate('1 -');
      }).to.throw('Insufficient number of arguments');
    });

    it('should throw when too many arguments given', () => {
      expect(() => {
        calculate('1 1 1 -');
      }).to.throw('Insufficient number of operations');
    });

    it('should properly substract numbers', () => {
      expect(calculate('10 1 -')).to.eq(9);
    });

    it('should not be commutative', () => {
      expect(calculate('2 1 -')).to.not.eq(calculate('1 2 -'));
    });

    it('should work on result of previous subtractions', () => {
      expect(calculate('10 5 1 - -')).to.eq(6);
    });

    it('should work when called two times', () => {
      expect(calculate('10 1 - 2 -')).to.eq(7);
    });
  });

  describe('Multiplication', () => {
    it('should accept "*" as a valid parameter', () => {
      calculate('3 3 *');
    });

    it('should throw when not enough operations given', () => {
      expect(() => {
        calculate('1 *');
      }).to.throw('Insufficient number of arguments');
    });

    it('should throw when too many arguments given', () => {
      expect(() => {
        calculate('1 1 1 *');
      }).to.throw('Insufficient number of operations');
    });

    it('should properly multiplicate numbers', () => {
      expect(calculate('2 3 *')).to.eq(6);
    });

    it('should be commutative', () => {
      expect(calculate('4 7 *')).to.eq(calculate('7 4 *'));
    });

    it('should work on result of multiplications', () => {
      expect(calculate('2 3 4 * *')).to.eq(24);
    });

    it('should work when called two times', () => {
      expect(calculate('10 4 * 7 *')).to.eq(280);
    });
  });

  describe('Integration', () => {
    it('should be smarter than average facebook user', () => {
      expect(calculate('2 2 * 2 +')).to.eq(6);
    });
  });
});
