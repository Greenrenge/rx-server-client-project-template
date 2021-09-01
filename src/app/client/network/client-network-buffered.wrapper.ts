import {Inject, Singleton} from 'typescript-ioc';
import {ClientNetworkThreadWrapper} from './client-network-thread.wrapper';
import {ClientEventNetwork} from './client-network.model';
import {NetworkDataType, NetworkEvent, NetworkMessage, NetworkPayload} from '../../shared/network/shared-network.model';
import {Observable, Subject} from 'rxjs';
import {ClientConfig} from '../config/client-config';
import deepmerge from 'deepmerge';

// TODO: Extract KeyValueBuffer class

@Singleton
export class ClientNetworkBufferedWrapper implements ClientEventNetwork<NetworkMessage> {
   private readonly bufferTimerMs = 1000 / ClientConfig.NETWORK_TICK_RATE;
   private readonly bindRequestBufferTimer;
   private bufferedEventsMessages = new Map<NetworkEvent, NetworkPayload>();
   private lastSentTime = 0;
   private sending = false;

   readonly connected$: Observable<void>;
   readonly disconnected$: Observable<void>;

   private readonly dataSubject = new Subject<NetworkMessage>();
   readonly data$ = this.dataSubject.asObservable();

   public constructor(
      @Inject private readonly thread: ClientNetworkThreadWrapper<NetworkDataType>,
   ) {
      this.bindRequestBufferTimer = this.requestBufferTimer.bind(this);
      this.connected$ = thread.connected$;
      this.disconnected$ = thread.disconnected$;
      thread.data$ // TODO: mergeMap messages => messages
         .subscribe(messages =>
            messages.forEach(message => this.dataSubject.next(message)));
   }

   isConnected(): boolean {
      return this.thread.isConnected();
   }

   connect(host: string): void {
      this.thread.connect(host);
   }

   disconnect(): void {
      this.thread.disconnect();
   }

   send<T>(event: NetworkEvent, data: T = {} as T): void {
      this.bufferedEventsMessages.set(event, this.getEventMessage(event, data));
      this.sendBufferedEventMessagesInTime();
   }

   private requestBufferTimer(): void {
      this.sendBufferedEventMessagesInTime();
      requestAnimationFrame(this.bindRequestBufferTimer);
   }

   protected sendBufferedEventMessagesInTime(): void {
      if (!this.sending && Date.now() > this.lastSentTime + this.bufferTimerMs) {
         this.sendBufferedEvents();
      }
   }

   private async sendBufferedEvents(): Promise<void> {
      if (this.bufferedEventsMessages.size === 0) {
         return null;
      }
      this.sending = true;
      this.lastSentTime = Date.now();
      if (this.thread.isConnected()) {
         const messages = this.getBufferedEventMessages();
         this.bufferedEventsMessages.clear();
         this.thread.send(messages);
      } else {
         console.log('Cannot send network messages, connection is not ready yet.');
      }
      this.sending = false;
   }

   private getBufferedEventMessages(): NetworkMessage[] {
      return Array.from(this.bufferedEventsMessages.entries())
         .filter((entry) => Object.keys(entry).length > 0)
         .map(([event, value]) => ({event, value}));
   }

   private getEventMessage<T = NetworkPayload>(event: NetworkEvent, value: T): NetworkPayload {
      return deepmerge.all([this.bufferedEventsMessages.get(event), value]);
   }
}
