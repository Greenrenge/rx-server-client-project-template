import {Singleton} from 'typescript-ioc';
import {interval} from 'rxjs';

@Singleton
export class IntervalService {
   readonly interval$ = interval(1000);
}
