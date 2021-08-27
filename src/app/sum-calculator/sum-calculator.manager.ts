import {Inject, Singleton} from 'typescript-ioc';
import {tap} from 'rxjs';
import {SumCalculatorService} from './sum-calculator.service';
import {IntervalService} from '../interval/interval.service';

@Singleton
export class SumCalculatorManager {
   public constructor(@Inject private readonly service: SumCalculatorService,
                      @Inject private readonly interval: IntervalService) {
      this.interval.interval$
         .pipe(
            tap(value => this.service.add(value)),
         )
         .subscribe(() => {
            console.log(this.service.getMeanAverage());
         });
   }
}
