import { assert, expect } from 'chai';
import {calculate} from '../src/calculator';

context('#calculate', () => {
   it('should return single number', () =>{
      expect(calculate("1")).to.eq(1);
   });

   it('should return single double digit number', () => {
      expect(calculate('22')).to.eq(22);
   });

});