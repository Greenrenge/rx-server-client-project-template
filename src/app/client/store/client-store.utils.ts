import {Store} from '../../shared/store/store';

export const updateOrRemove = <T>(store: Store<T>, key: string, value: T | null): void => {
   if (value === null) {
      store.remove(key);
   } else {
      store.update(key, value);
   }
}
