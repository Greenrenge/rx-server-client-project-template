import {Inject, Singleton} from 'typescript-ioc';
import {ClientNetworkService} from './client-network.service';
import {ClientConfig} from '../config/client-config';
import {generateId} from '../../shared/utils/utils';
import {ClientPlayerService} from '../player/client-player.service';
import {Store} from '../../shared/store/store';
import {PlayerStore} from '../../shared/player/player-store';
import {mergeMap} from 'rxjs';

@Singleton
export class ClientNetworkManager {
   public constructor(
      @Inject private readonly service: ClientNetworkService,
      @Inject private readonly player: ClientPlayerService,
      @Inject private readonly playerStore: PlayerStore,
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
      player.clientInit$.subscribe((player) => {
         this.subscribeStoreOnCommitToNetwork(playerStore, player.id);
         this.subscribeNetworkUpdateToStore(playerStore);
      });
      this.service.connect(ClientConfig.SERVER_HOSTS[0].url);
   }

   // Commits to the store value will be sent to the network
   private subscribeStoreOnCommitToNetwork<T>(store: Store<T>, id: string): void {
      store.onCommitted(id).subscribe((value) => {
         this.service.sendStore(store.getId(), id, value);
      });
   }

   // Updates from the network will be merged into the store
   private subscribeNetworkUpdateToStore<T>(store: Store<T>): void {
      this.service.onStoreEvent(store.getId())
         .pipe(
            mergeMap((store) => Array.from(Object.entries(store.getAll()))),
         )
         .subscribe(([id, entity]: [string, T]) => {
            // null values can go through the network but it means that it should be removed
            if (entity === null) {
               store.remove(id);
            } else {
               store.update(id, entity);
            }
         });
   }
}
