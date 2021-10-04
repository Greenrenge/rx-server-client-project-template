import {Store} from './store';

class MockStore extends Store<string> {
   public getId(): string {
      return MockStore.name;
   }
}

describe('Store', () => {
   let store: MockStore;

   beforeEach(() => {
      store = new MockStore();
   });

   it('should be created', () => {
      expect(store).toBeDefined();
   });

   it('should return store id', () => {
      expect(store.getId()).toEqual('MockStore');
   });

   describe('update', () => {
      it('should add new entity', () => {
         store.update('id', 'value');
         const result = store.get('id');
         expect(result).toEqual('value');
      });

      it('should update existing entity', () => {
         store.update('id', 'value');
         store.update('id', 'updated');
         const result = store.get('id');
         expect(result).toEqual('updated');
      });
   });

   describe('commit', () => {
      it('should add new entity', () => {
         store.commit('id', 'value');
         const result = store.get('id');
         expect(result).toEqual('value');
      });

      it('should update existing entity', () => {
         store.commit('id', 'value');
         store.commit('id', 'updated');
         const result = store.get('id');
         expect(result).toEqual('updated');
      });
   });

   describe('remove', () => {
      it('should remove entity', () => {
         store.update('id', 'value');
         store.remove('id');
         const result = store.get('id');
         expect(result).toBeUndefined();
      });

      it('should not remove other entity', () => {
         store.update('id1', 'value1');
         store.update('id2', 'value2');
         store.remove('id2');
         const result = store.get('id1');
         expect(result).toEqual('value1');
      });
   });

   describe('get', () => {
      it('should return value', () => {
         store.update('id', 'value');
         const result = store.get('id');
         expect(result).toEqual('value');
      });

      it('should not return other value', () => {
         store.update('id1', 'value1');
         store.update('id2', 'value2');
         store.update('id3', 'value3');
         const result = store.get('id2');
         expect(result).toEqual('value2');
      });

      it('should not undefined', () => {
         store.update('id1', 'value1');
         const result = store.get('id2');
         expect(result).toBeUndefined();
      });
   });

   describe('getAll', () => {
      it('should return values as a map', () => {
         store.update('id1', 'value1');
         store.update('id2', 'value2');
         const result = store.getAll();
         expect(result).toEqual({
            id1: 'value1',
            id2: 'value2',
         });
      });

      it('should return empty map', () => {
         const result = store.getAll();
         expect(result).toEqual({});
      });
   });

   describe('clearAll', () => {
      it('should remove entities', () => {
         store.update('id1', 'value1');
         store.update('id2', 'value2');
         store.clearAll();
         const result = store.getAll();
         expect(result).toEqual({});
      });
   });

   describe('Events', () => {
      let calls: string[];

      beforeEach(() => {
         calls = [];
         store.onAdded('id').subscribe(() => calls.push('added'));
         store.onCommitted('id').subscribe(() => calls.push('committed'));
         store.onUpdated('id').subscribe(() => calls.push('updated'));
         store.onChanged('id').subscribe(() => calls.push('changed'));
         store.onRemoved('id').subscribe(() => calls.push('removed'));
      });

      describe('update', () => {
         it('should be added, changed and updated', () => {
            store.update('id', 'value');
            expect(calls).toEqual(['added', 'changed', 'updated']);
         });

         it('should be changed and updated', () => {
            store.update('id', 'value');
            calls = [];
            store.update('id', 'value');
            expect(calls).toEqual(['changed', 'updated']);
         });
      });

      describe('commit', () => {
         it('should be added, changed and committed', () => {
            store.commit('id', 'value');
            expect(calls).toEqual(['added', 'changed', 'committed']);
         });

         it('should be changed and committed', () => {
            store.commit('id', 'value');
            calls = [];
            store.commit('id', 'value');
            expect(calls).toEqual(['changed', 'committed']);
         });
      });

      describe('remove', () => {
         it('should be removed and committed', () => {
            store.commit('id', 'value');
            calls = [];
            store.remove('id');
            expect(calls).toEqual(['removed', 'committed']);
         });

         it('should not call anything', () => {
            store.commit('id', 'value');
            calls = [];
            store.remove('id2');
            expect(calls).toEqual([]);
         });
      });
   });

   describe('size', () => {
      it('should be 0 by default', () => {
         expect(store.getSize()).toEqual(0);
      });

      it('should be 1 after adding one', () => {
         store.commit('id', 'value');
         expect(store.getSize()).toEqual(1);
      });

      it('should be 2 after remove one from three', () => {
         store.commit('1', '1');
         store.commit('2', '2');
         store.commit('3', '3');
         store.remove('3')
         expect(store.getSize()).toEqual(2);
      });
   });
});
