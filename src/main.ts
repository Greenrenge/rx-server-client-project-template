import './main.scss';
import {Container, Inject} from 'typescript-ioc';
import {SumCalculatorManager} from './app/sum-calculator/sum-calculator.manager';

class Main {
   public constructor(
      @Inject private readonly foo: SumCalculatorManager,
   ) {
      console.log('Started');
   }
}

Container.get(Main);
