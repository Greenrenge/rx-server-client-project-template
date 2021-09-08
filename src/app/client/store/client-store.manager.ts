import {Inject, Singleton} from 'typescript-ioc';
import {ClientNetworkService} from '../network/client-network.service';
import {ClientPlayerService} from '../player/client-player.service';
import {Store} from '../../shared/store/store';
import {mergeMap} from 'rxjs';
import {PlayerStore} from '../../shared/player/player-store';
import {updateOrRemove} from './client-store.utils';

@Singleton
export class ClientStoreManager {
   constructor(
      @Inject private readonly network: ClientNetworkService,
      @Inject private readonly player: ClientPlayerService,
      @Inject private readonly playerStore: PlayerStore,
   ) {
      player.clientInit$.subscribe((player) => {
         this.subscribeStoreOnCommitToNetwork(playerStore, player.id);
         this.subscribeNetworkUpdateToStore(playerStore);
      });
   }

   // Commits to the store value will be sent to the network
   private subscribeStoreOnCommitToNetwork<T>(store: Store<T>, key: string): void {
      store.onCommitted(key).subscribe((value) => {
         this.network.sendStore(store.getId(), key, value);
      });
   }

   // Updates from the network will be merged into the store
   private subscribeNetworkUpdateToStore<T>(store: Store<T>): void {
      this.network.onStoreDto<T>(store.getId())
         .pipe(
            mergeMap((storeData) => Array.from(Object.entries(storeData))),
         )
         .subscribe(([key, entity]) => updateOrRemove(store, key, entity));
   }
}
