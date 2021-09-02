import {Singleton} from 'typescript-ioc';
import {ClientNetworkUsingOnlyFunctions, ClientNetwork} from './client-network.model';
import {ReplaySubject, Subject} from 'rxjs';
import {spawn, Worker} from 'threads';
import 'threads/register';
// @ts-ignore
import workerURL from 'threads-plugin/dist/loader?name=network!./client-network-thread';

@Singleton
export class ClientNetworkThreadWrapper<T> implements ClientNetwork<T> {
   private readonly connectedSubject = new Subject<void>();
   readonly connected$ = this.connectedSubject.asObservable();

   private readonly disconnectedSubject = new Subject<void>();
   readonly disconnected$ = this.disconnectedSubject.asObservable();

   private readonly dataSubject = new Subject<T>();
   readonly data$ = this.dataSubject.asObservable();

   private initializedSubject = new ReplaySubject<void>();
   private readonly initialized$ = this.initializedSubject.asObservable();

   private thread?: ClientNetworkUsingOnlyFunctions<T>;

   constructor() {
      this.initThread();
   }

   private async initThread(): Promise<void> {
      console.log('Network thread loading..');
      this.thread = (await spawn(
         new Worker(workerURL, {type: 'module'}),
      ) as unknown) as ClientNetworkUsingOnlyFunctions<T>;
      this.thread.onConnected().subscribe(() => this.connectedSubject.next());
      this.thread.onDisconnected().subscribe(() => this.disconnectedSubject.next());
      this.thread.onData().subscribe((data) => this.dataSubject.next(data));
      console.log('Network thread initialized');
      this.initializedSubject.next();
   }

   isConnected(): boolean {
      return this.thread?.isConnected() ?? false;
   }

   connect(host: string): void {
      this.initialized$.subscribe(() => {
         this.thread?.connect(host);
      })
   }

   disconnect(): void {
      this.thread?.disconnect();
   }

   send(data: T): void {
      this.thread?.send(data);
   }
}
