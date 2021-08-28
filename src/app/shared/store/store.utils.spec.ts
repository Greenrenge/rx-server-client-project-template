import {StoreEntity} from './store.model';
import {Subject} from 'rxjs';
import {filterById} from './store.utils';

describe('StoreUtils', () => {
   describe('filterById', () => {
      it('should return filtered entity value', () => {
         const source = new Subject<StoreEntity<string>>();
         const observable = filterById(source, 'id');
         let result;
         observable.subscribe(value => result = value);
         source.next({id: 'id', value: 'value'});
         expect(result).toEqual('value');
      });

      it('should be called only once', () => {
         const source = new Subject<StoreEntity<string>>();
         const observable = filterById(source, 'id');
         let called = 0;
         observable.subscribe(() => called++);
         source.next({id: 'id', value: 'value'});
         expect(called).toEqual(1);
      });

      it('should not return value from other id', () => {
         const source = new Subject<StoreEntity<string>>();
         const observable = filterById(source, 'id');
         let called = 0;
         observable.subscribe(() => called++);
         source.next({id: 'other-id', value: 'value'});
         expect(called).toEqual(0);
      });
   });
});
