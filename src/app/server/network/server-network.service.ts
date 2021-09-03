import {Inject, Singleton} from 'typescript-ioc';
import {ServerNetworkWrapper} from './server-network.wrapper';
import {ServerNetworkMessage} from './server-network.model';
import {LoginRequest, LoginResponse, NetworkEvent} from '../../shared/network/shared-network.model';
import {filter, map, Observable} from 'rxjs';

@Singleton
export class ServerNetworkService {
   readonly clientConnectedId$: Observable<string>;
   readonly clientDisconnectedId$: Observable<string>;
   private data$: Observable<ServerNetworkMessage>;
   // readonly dataStore$: Observable<{ [key: string]: AllStores }>;
   readonly loginRequest$: Observable<ServerNetworkMessage<LoginRequest>>;

   constructor(@Inject private readonly wrapper: ServerNetworkWrapper) {
      this.clientConnectedId$ = wrapper.clientConnectedId$;
      this.clientDisconnectedId$ = wrapper.clientDisconnectedId$;
      this.data$ = wrapper.clientData$;
      this.loginRequest$ = this.onMessage<LoginRequest>(NetworkEvent.LOGIN);
      // this.dataStore$ = this.onEvent(NetworkEvent.DATA_STORE);
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

   sendLoginResponse(user: string, response: LoginResponse): void {
      this.wrapper.send(user, {event: NetworkEvent.LOGIN, value: response});
   }
}
