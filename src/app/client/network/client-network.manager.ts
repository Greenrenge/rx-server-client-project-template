import {Inject, Singleton} from 'typescript-ioc';
import {ClientNetworkService} from './client-network.service';
import {ClientConfig} from '../config/client-config';
import {generateId} from '../../shared/utils/utils';

@Singleton
export class ClientNetworkManager {
   public constructor(
      @Inject private readonly service: ClientNetworkService,
   ) {
      service.connected$.subscribe(() => {
         console.log('Connected to the server, Sending login request..');
         service.sendLoginRequest({
            userName: generateId(),
         });
      });
      service.loginOk$.subscribe(response => {
         console.log('Login OK', response);
      });
      service.loginFailed$.subscribe(response => {
         console.log('Login Failed', response);
      });
      this.service.connect(ClientConfig.SERVER_HOSTS[0].url);
   }
}
