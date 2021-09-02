import {TimeMapBuffer} from './time-map-buffer';

interface MockInterface {
   foo?: string;
   bar?: string;
   baz?: string;
}

describe('TimeMapBuffer', () => {
   let buffer: TimeMapBuffer<string, MockInterface>;
   const frameLengthMs = 1000;

   beforeEach(() => {
      jest.useFakeTimers();
      jest.spyOn(window, 'requestAnimationFrame')
         .mockImplementation(cb => setTimeout(cb, frameLengthMs));

      buffer = new TimeMapBuffer<string, MockInterface>();
      buffer.setDefaultValue({} as MockInterface);
      buffer.setFrameLengthMs(frameLengthMs);
   });

   afterEach(() => {
      buffer.stop();
   });

   it('should be created', () => {
      expect(buffer).toBeDefined();
   });

   it('should emit data immediately', () => {
      let result;
      buffer.data$.subscribe(data => result = data);
      buffer.add('key', {foo: 'foo'} as MockInterface);
      buffer.add('key', {bar: 'bar'} as MockInterface);
      expect(result).toEqual([['key', {foo: 'foo'} as MockInterface]]);
   });

   it('should not emit data after stopping', () => {
      let result;
      buffer.data$.subscribe(data => result = data);
      buffer.stop();
      buffer.add('key', {foo: 'foo'} as MockInterface);
      expect(result).toBeUndefined();
   });

   it('should merge values in frame time', () => {
      let result;
      buffer.data$.subscribe(data => result = data);
      // First one will be emitted immediately
      buffer.add('key', {foo: 'foo'} as MockInterface);
      // The second and the third one will be merged and then emitted when the timer is mocked
      buffer.add('key', {bar: 'bar'} as MockInterface);
      buffer.add('key', {baz: 'baz'} as MockInterface);
      jest.spyOn(Date, 'now').mockReturnValue(Infinity);
      jest.advanceTimersByTime(frameLengthMs + 1);
      expect(result).toEqual([['key', {
         bar: 'bar',
         baz: 'baz',
      } as MockInterface]]);
   });
});
