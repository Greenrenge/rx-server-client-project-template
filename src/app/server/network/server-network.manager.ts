import {Inject, Singleton} from 'typescript-ioc';
import {ServerNetworkService} from './server-network.service';

@Singleton
export class ServerNetworkManager {
   constructor(
      @Inject private readonly service: ServerNetworkService,
   ) {
   }
}
