import {generateId} from './utils';

describe('UtilsUtils', () => {
   describe('generateId', () => {
      it('should return value for 0', () => {
         jest.spyOn(Math, 'random').mockReturnValue(0);
         const result = generateId();
         expect(result).toEqual('3llllllllm');
      });

      it('should return value for 0.5', () => {
         jest.spyOn(Math, 'random').mockReturnValue(0.5);
         const result = generateId();
         expect(result).toEqual('lf4bipx4bk');
      });

      it('should return value for 1', () => {
         jest.spyOn(Math, 'random').mockReturnValue(1);
         const result = generateId();
         expect(result).toEqual('38n1fu8n1f');
      });
   });
});
