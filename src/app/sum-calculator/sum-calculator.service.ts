import {Singleton} from 'typescript-ioc';
import {meanAverage} from './sum-calculator.utils';

@Singleton
export class SumCalculatorService {
   private values: number[] = [];

   add(value: number): void {
      this.values.push(value);
   }

   getMeanAverage(): number | undefined {
      return meanAverage(this.values);
   }
}
