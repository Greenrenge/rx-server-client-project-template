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
         service.sendLoginRequest({
            userName: generateId(),
         });
      });
      service.loginOk$.subscribe(() => {
      });
      service.loginFailed$.subscribe(() => {
      });
      this.service.connect(ClientConfig.SERVER_HOSTS[0].url);
   }
}
