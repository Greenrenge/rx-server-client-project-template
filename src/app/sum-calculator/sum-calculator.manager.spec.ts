import {SumCalculatorManager} from './sum-calculator.manager';
import {SumCalculatorService} from './sum-calculator.service';
import {IntervalService} from '../interval/interval.service';
import {Subject} from 'rxjs';

describe('SumCalculatorManager', () => {
   let manager: SumCalculatorManager;
   let sumCalculatorService: SumCalculatorService;
   let intervalService: IntervalService;
   const intervalSubject = new Subject<number>();

   beforeEach(() => {
      sumCalculatorService = {
         add: jest.fn(),
         getMeanAverage: jest.fn(),
      } as unknown as SumCalculatorService;
      intervalService = {
         interval$: intervalSubject.asObservable(),
      } as unknown as IntervalService;
      manager = new SumCalculatorManager(
         sumCalculatorService,
         intervalService,
      );
   });

   it('should be created', () => {
      expect(manager).toBeDefined();
   });

   it('should add value', () => {
      const addSpy = jest.spyOn(sumCalculatorService, 'add');
      intervalSubject.next(1);
      expect(addSpy).toHaveBeenCalledWith(1);
   });

   it('should call getMeanAverage', () => {
      const getMeanAverageSpy = jest.spyOn(sumCalculatorService, 'getMeanAverage');
      intervalSubject.next(1);
      expect(getMeanAverageSpy).toHaveBeenCalled();
   });
});
