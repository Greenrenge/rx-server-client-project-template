import {Inject, Singleton} from 'typescript-ioc';
import {ServerNetworkWrapper} from './server-network.wrapper';
import {ServerNetworkMessage} from './server-network.model';
import {NetworkEvent} from '../../shared/network/shared-network.model';
import {filter, map, Observable} from 'rxjs';

@Singleton
export class ServerNetworkService {
   private data$: Observable<ServerNetworkMessage>;
   readonly clientConnectedId$: Observable<string>;
   readonly clientDisconnectedId$: Observable<string>;
   // readonly dataStore$: Observable<{ [key: string]: AllStores }>;
   // readonly joinRequest$: Observable<ServerNetworkMessage<JoinRequest>>;

   constructor(@Inject private readonly wrapper: ServerNetworkWrapper) {
      this.clientConnectedId$ = wrapper.clientConnectedId$;
      this.clientDisconnectedId$ = wrapper.clientDisconnectedId$;
      this.data$ = wrapper.clientData$;
      // this.dataStore$ = this.onEvent(NetworkEvent.DATA_STORE);
      // this.joinRequest$ = this.onMessage<JoinRequest>(NetworkEvent.JOIN_REQUEST);
   }

   private onData<T>(event: NetworkEvent): Observable<T> {
      return this.onMessage<T>(event).pipe(map((message) => message.value));
   }

   private onMessage<T>(event: NetworkEvent): Observable<ServerNetworkMessage<T>> {
      return this.data$.pipe(
         filter((message) => message.event === event),
         map((message) => (message as unknown) as ServerNetworkMessage<T>),
      );
   }

   // sendLoginResponse(user: string, response: JoinResponse): void {
   //   this.wrapper.send(user, {event: NetworkEvent.JOIN_RESPONSE, value: response});
   // }
}
