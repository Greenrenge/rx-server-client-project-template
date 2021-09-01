import {Inject, Singleton} from 'typescript-ioc';
import {ClientNetworkService} from './client-network.service';

@Singleton
export class ClientNetworkManager {
   public constructor(
      @Inject private readonly service: ClientNetworkService,
   ) {
   }
}
