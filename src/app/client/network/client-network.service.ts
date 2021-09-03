import {Inject, Singleton} from 'typescript-ioc';
import {ClientNetworkBufferedWrapper} from './client-network-buffered.wrapper';
import {
   LoginRequest,
   LoginResponse,
   LoginStatus,
   NetworkEvent,
   SuccessfulLoginResponse,
} from '../../shared/network/shared-network.model';
import {filter, map, Observable} from 'rxjs';
import {share} from 'rxjs/operators';

@Singleton
export class ClientNetworkService {
   readonly connected$: Observable<void>;
   readonly disconnected$: Observable<void>;
   private readonly joinResponse$: Observable<LoginResponse>;
   readonly loginOk$: Observable<SuccessfulLoginResponse>;
   readonly loginFailed$: Observable<LoginStatus>;

   public constructor(
      @Inject private readonly wrapper: ClientNetworkBufferedWrapper,
   ) {
      this.connected$ = wrapper.connected$;
      this.disconnected$ = wrapper.disconnected$;
      this.joinResponse$ = this.onEvent<LoginResponse>(NetworkEvent.LOGIN);
      this.loginOk$ = this.joinResponse$.pipe(
         filter((response) => response.status === LoginStatus.OK),
         share(),
      );
      this.loginFailed$ = this.joinResponse$.pipe(
         filter(response => response.status !== LoginStatus.OK),
         map(response => response.status),
         share(),
      );
   }

   connect(host: string): void {
      this.wrapper.connect(host);
   }

   sendLoginRequest(request: LoginRequest): void {
      this.wrapper.send(NetworkEvent.LOGIN, request);
   }

   private onEvent<T>(event: NetworkEvent): Observable<T> {
      return this.wrapper.data$.pipe(
         filter((message) => message.event === event),
         map((message) => (message.value as unknown) as T),
         share(),
      );
   }
}
