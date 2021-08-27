import {meanAverage} from './sum-calculator.utils';

describe('SumCalculatorUtils', () => {
   describe('meanAverage', () => {
      it('should be undefined', () => {
         const result = meanAverage([]);
         expect(result).toBeUndefined();
      });

      it('should be 0', () => {
         const result = meanAverage([0]);
         expect(result).toEqual(0);
      });

      it('should be 2.5', () => {
         const result = meanAverage([0, 5]);
         expect(result).toEqual(2.5);
      });
   });
});
