import {Singleton} from 'typescript-ioc';
import {SharedPlayerService} from '../../shared/player/shared-player.service';

@Singleton
export class ServerPlayerService extends SharedPlayerService {
   public constructor() {
      super();
   }

   getNrOfPlayers(): number {
      return 0;
   }

   add(id: string, requestedName: string): void {
      //
   }
}
