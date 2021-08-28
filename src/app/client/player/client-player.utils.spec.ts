import {returnOne} from './client-player.utils';

describe('ClientPlayerUtils', () => {
   describe('returnOne', () => {
      it('should be 1', () => {
         expect(returnOne()).toEqual(1);
      });
   });
});
