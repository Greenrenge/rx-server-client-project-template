import {Inject, Singleton} from 'typescript-ioc';
import {SharedPlayerService} from '../../shared/player/shared-player.service';
import {PlayerStore} from '../../shared/player/player-store';

@Singleton
export class ServerPlayerService extends SharedPlayerService {
   public constructor(
      @Inject private readonly store: PlayerStore,
   ) {
      super();
   }

   getNrOfPlayers(): number {
      return this.store.getSize();
   }

   add(id: string, requestedName: string): void {
      this.store.commit(id, {
         id,
         name: requestedName,
      });
   }

   remove(id: string): void {
      this.store.remove(id);
   }
}
