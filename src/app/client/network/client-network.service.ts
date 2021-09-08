import {Inject, Singleton} from 'typescript-ioc';
import {ClientNetworkBufferedWrapper} from './client-network-buffered.wrapper';
import {
   LoginRequest,
   LoginResponse,
   LoginStatus,
   NetworkEvent,
   SuccessfulLoginResponse,
} from '../../shared/network/shared-network.model';
import {filter, map, mergeMap, Observable} from 'rxjs';
import {share} from 'rxjs/operators';
import {keyValueObject} from '../../shared/utils/utils';
import {Stores} from '../../shared/store/store.model';
import {Store} from '../../shared/store/store';

@Singleton
export class ClientNetworkService {
   readonly connected$: Observable<void>;
   readonly disconnected$: Observable<void>;
   private readonly joinResponse$: Observable<LoginResponse>;
   readonly loginOk$: Observable<SuccessfulLoginResponse>;
   readonly loginFailed$: Observable<LoginStatus>;
   readonly storesData$: Observable<Stores>;

   public constructor(
      @Inject private readonly wrapper: ClientNetworkBufferedWrapper,
   ) {
      this.connected$ = wrapper.connected$;
      this.disconnected$ = wrapper.disconnected$;
      this.joinResponse$ = this.onEvent<LoginResponse>(NetworkEvent.LOGIN);
      this.loginOk$ = this.joinResponse$.pipe(
         filter((response) => response.status === LoginStatus.OK),
         map(response => response as SuccessfulLoginResponse),
         share(),
      );
      this.loginFailed$ = this.joinResponse$.pipe(
         filter(response => response.status !== LoginStatus.OK),
         map(response => response.status),
         share(),
      );
      this.storesData$ = this.onEvent<Stores>(NetworkEvent.STORE);
   }

   connect(host: string): void {
      this.wrapper.connect(host);
   }

   sendLoginRequest(request: LoginRequest): void {
      this.wrapper.send(NetworkEvent.LOGIN, request);
   }

   sendStore<T>(storeId: string, key: string, value: T): void {
      const data = keyValueObject(storeId, keyValueObject(key, value));
      this.wrapper.send(NetworkEvent.STORE, data);
   }

   onStoreEvent<T extends Store<unknown>>(storeId: string): Observable<T> {
      return this.storesData$.pipe(
         mergeMap(store => Object.values(store)),
         filter(store => store.getId() === storeId),
         share(),
      ) as Observable<T>;
   }

   private onEvent<T>(event: NetworkEvent): Observable<T> {
      return this.wrapper.data$.pipe(
         filter((message) => message.event === event),
         map((message) => (message.value as unknown) as T),
         share(),
      );
   }
}
