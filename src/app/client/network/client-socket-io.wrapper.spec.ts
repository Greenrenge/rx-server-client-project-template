import {ClientSocketIoWrapper} from './client-socket-io.wrapper';
import {Observable, Subject} from 'rxjs';
import {SocketEvent} from '../../shared/network/shared-socket.wrapper.model';

const socketEventSubjects: { [key in SocketEvent]: Subject<unknown> } = {
   connect: new Subject<unknown>(),
   disconnect: new Subject<unknown>(),
   data: new Subject<unknown>(),
};
const socketEvents: { [key in SocketEvent]: Observable<unknown> } = {
   connect: socketEventSubjects['connect'].asObservable(),
   disconnect: socketEventSubjects['disconnect'].asObservable(),
   data: socketEventSubjects['data'].asObservable(),
};

jest.mock('socket.io-client', () => ({
// @ts-ignore
   io: () => new (function () {
      this.connected = false;
      this.connect = () => {
         this.connected = true;
         socketEventSubjects['connect'].next(null);
      };
      this.disconnect = () => {
         this.connected = false;
         socketEventSubjects['disconnect'].next(null);
      };
      this.addEventListener = (eventName: SocketEvent, handler: (...args: unknown[]) => void) => {
         socketEvents[eventName as SocketEvent].subscribe(data => handler(data));
      };
      this.removeEventListener = () => {
      };
   })(),
}));

describe('ClientSocketIoWrapper', () => {
   let wrapper: ClientSocketIoWrapper<string>;

   beforeEach(() => {
      wrapper = new ClientSocketIoWrapper<string>();
   });

   it('should be created', () => {
      expect(wrapper).toBeDefined();
   });

   describe('Connected', () => {
      it('should be connected', () => {
         wrapper.connect('host');
         expect(wrapper.isConnected()).toEqual(true);
      });

      it('should be disconnected', () => {
         wrapper.connect('host');
         wrapper.disconnect();
         expect(wrapper.isConnected()).toEqual(false);
      });
   });

   describe('Events', () => {
      it('should emit connected', () => {
         let result;
         wrapper.connected$.subscribe(() => result = true);
         wrapper.connect('host');
         expect(result).toEqual(true);
      });

      it('should emit disconnected', () => {
         let result;
         wrapper.disconnected$.subscribe(() => result = true);
         wrapper.connect('host');
         wrapper.disconnect();
         expect(result).toEqual(true);
      });

      it('should emit data', () => {
         let result;
         wrapper.data$.subscribe(data => result = data);
         wrapper.connect('host');
         socketEventSubjects['data'].next('data');
         expect(result).toEqual('data');
      });
   });
})
