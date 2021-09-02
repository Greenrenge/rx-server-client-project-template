import {Subject} from 'rxjs';
import {ClientNetworkThreadWrapper} from './client-network-thread.wrapper';

const connectedSubject = new Subject<void>();
const connected$ = connectedSubject.asObservable();

const disconnectedSubject = new Subject<void>();
const disconnected$ = disconnectedSubject.asObservable();

const dataSubject = new Subject<string>();
const data$ = dataSubject.asObservable();

jest.mock('threads', () => ({
   spawn: async (a: unknown): Promise<unknown> => a,
   Worker: function () {
      let connected = false;
      this.onConnected = () => connected$;
      this.onDisconnected = () => disconnected$;
      this.onData = () => data$;
      this.isConnected = () => connected;
      this.connect = () => {
         connected = true;
         connectedSubject.next();
      };
      this.disconnect = () => {
         connected = false;
         disconnectedSubject.next();
      };
      this.send = (data: string) => dataSubject.next(data);
   },
}));

jest.mock('../utils/worker-url.utils', () => ({
   clientNetworkThreadUrl: 'workerURL',
}));

describe('ClientNetworkThreadWrapper', () => {
   let wrapper: ClientNetworkThreadWrapper<string>;

   beforeEach(() => {
      wrapper = new ClientNetworkThreadWrapper<string>();
   });

   it('should be created', () => {
      expect(wrapper).toBeDefined();
   });

   describe('Events', () => {
      it('should escalate connected', () => {
         let result = false;
         wrapper.connected$.subscribe(() => result = true);
         wrapper.connect('host');
         expect(result).toEqual(true);
      });

      it('should escalate disconnected', () => {
         let result = false;
         wrapper.disconnected$.subscribe(() => result = true);
         wrapper.connect('host');
         wrapper.disconnect();
         expect(result).toEqual(true);
      });

      it('should escalate data', () => {
         let result;
         wrapper.data$.subscribe(data => result = data);
         wrapper.connect('host');
         wrapper.send('data');
         expect(result).toEqual('data');
      });
   });
   describe('Events', () => {
      it('should be false by default', () => {
         expect(wrapper.isConnected()).toEqual(false);
      });

      it('should be true when connected', () => {
         wrapper.connect('host');
         expect(wrapper.isConnected()).toEqual(true);
      });

      it('should be false after disconnected', () => {
         wrapper.connect('host');
         wrapper.disconnect();
         expect(wrapper.isConnected()).toEqual(false);
      });
   });
});
