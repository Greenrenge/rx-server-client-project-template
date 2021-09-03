import {Container, Inject, Singleton} from 'typescript-ioc';
import {ClientSocketIoWrapper} from './client-socket-io.wrapper';
import {map, Observable} from 'rxjs';
import {MsgpackJsonEncoder} from '../../shared/network/msgpack-json-encoder';
import {ClientNetworkUsingOnlyFunctions} from './client-network.model';
import {expose} from 'threads';

@Singleton
export class ClientNetworkThread<T> implements ClientNetworkUsingOnlyFunctions<T> {
   constructor(
      @Inject private readonly wrapper: ClientSocketIoWrapper<Buffer>,
      @Inject private readonly encoder: MsgpackJsonEncoder<T>,
   ) {
      console.log('Network thread started');
   }

   onConnected(): Observable<void> {
      // null-ish data will not fire on the main thread for some reason
      // @ts-ignore
      return this.wrapper.connected$.pipe(map(() => ' '));
   }

   onDisconnected(): Observable<void> {
      // null-ish data will not fire on the main thread for some reason
      // @ts-ignore
      return this.wrapper.disconnected$.pipe(map(() => ' '));
   }

   onData(): Observable<T> {
      return this.decode(this.wrapper.data$);
   }

   connect(host: string): void {
      this.wrapper.connect(host);
   }

   disconnect(): void {
      this.wrapper.disconnect();
   }

   isConnected(): boolean {
      return this.wrapper.isConnected();
   }

   send(data: T): void {
      this.wrapper.send(this.encode(data));
   }

   private decode(source$: Observable<Buffer>): Observable<T> {
      return source$.pipe(map((buffer) => this.encoder.decode(buffer) as T));
   }

   private encode(data: T): Buffer {
      return this.encoder.encode(data);
   }
}

const thread = Container.get(ClientNetworkThread);

expose({
   onConnected: thread.onConnected.bind(thread),
   onDisconnected: thread.onDisconnected.bind(thread),
   onData: thread.onData.bind(thread),
   connect: thread.connect.bind(thread),
   disconnect: thread.disconnect.bind(thread),
   isConnected: thread.isConnected.bind(thread),
   send: thread.send.bind(thread),
});
