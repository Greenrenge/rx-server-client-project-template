import {Inject, Singleton} from 'typescript-ioc';
import {ClientPlayerWrapper} from './client-player.wrapper';
import {SharedPlayerService} from '../../shared/player/shared-player.service';

@Singleton
export class ClientPlayerService extends SharedPlayerService {
   public constructor(@Inject private readonly wrapper: ClientPlayerWrapper) {
      super();
   }
}
