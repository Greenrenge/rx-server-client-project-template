import {SumCalculatorService} from './sum-calculator.service';
import * as Utils from './sum-calculator.utils';

describe('SumCalculatorService', () => {
   let service: SumCalculatorService;

   beforeEach(() => {
      service = new SumCalculatorService();
   });

   it('should be created', () => {
      expect(service).toBeDefined();
   });

   it('should return meanAverage', () => {
      const meanAverageSpy = jest.spyOn(Utils, 'meanAverage').mockReturnValue(2);
      service.add(0);
      service.add(1);
      expect(service.getMeanAverage()).toEqual(2);
      expect(meanAverageSpy).toHaveBeenCalledWith([0, 1]);
   });
});
