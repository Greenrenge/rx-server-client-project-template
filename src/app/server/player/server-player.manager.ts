import {Inject, Singleton} from 'typescript-ioc';
import {ServerPlayerService} from './server-player.service';

@Singleton
export class ServerPlayerManager {
   public constructor(
      @Inject private readonly service: ServerPlayerService,
   ) {
   }
}
