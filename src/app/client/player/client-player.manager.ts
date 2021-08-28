import {Inject, Singleton} from 'typescript-ioc';
import {ClientPlayerService} from './client-player.service';

@Singleton
export class ClientPlayerManager {
   public constructor(
      @Inject private readonly service: ClientPlayerService,
   ) {
   }
}
