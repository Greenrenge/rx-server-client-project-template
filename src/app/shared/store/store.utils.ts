import {map, Observable} from 'rxjs';
import {StoreEntity} from './store.model';
import {filter, share} from 'rxjs/operators';

export const filterById = <T>(source: Observable<StoreEntity<T>>, id: string): Observable<T> =>
   source.pipe(
      filter((entity) => entity.id === id),
      map(entity => entity.value),
      share(),
   );
