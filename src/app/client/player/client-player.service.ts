import {Inject, Singleton} from 'typescript-ioc';
import {ClientPlayerWrapper} from './client-player.wrapper';
import {SharedPlayerService} from '../../shared/player/shared-player.service';
import {Player} from '../../shared/player/player.model';
import {Subject} from 'rxjs';
import {PlayerStore} from '../../shared/player/player-store';

@Singleton
export class ClientPlayerService extends SharedPlayerService {
   private readonly clientInitSubject = new Subject<Player>();
   readonly clientInit$ = this.clientInitSubject.asObservable();

   private clientId?: string;

   public constructor(
      @Inject private readonly wrapper: ClientPlayerWrapper,
      @Inject private readonly store: PlayerStore,
   ) {
      super();
   }

   setClientPlayer(player: Player): void {
      this.clientId = player.id;
      this.store.update(player.id, player);
      this.clientInitSubject.next(player);
   }
}
