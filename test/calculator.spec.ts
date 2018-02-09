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

    it('should throw when too many parameters given', () => {
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

    it('should work on big numbers', () => {
      expect(calculate('9999999999 9999999999 +')).to.eq(19999999998);
    });
  });
});
