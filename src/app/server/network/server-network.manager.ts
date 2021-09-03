import {Inject, Singleton} from 'typescript-ioc';
import {ServerNetworkService} from './server-network.service';
import {StoreEntity} from '../../shared/store/store.model';
import {Store} from '../../shared/store/store';
import {map, Observable} from 'rxjs';
import {filter} from 'rxjs/operators';
import {LoginStatus, SuccessfulLoginResponse} from '../../shared/network/shared-network.model';
import {PlayerStore} from '../../shared/player/player-store';

@Singleton
export class ServerNetworkManager {
   constructor(
      @Inject private readonly service: ServerNetworkService,
      @Inject private readonly playerStore: PlayerStore,
   ) {
      this.subscribeNetworkUpdateToStore(playerStore);
      this.subscribeStoreToNetworkExceptEntity(this.playerStore, this.playerStore.updated$);
      this.subscribeStoreToNetwork(playerStore, playerStore.committed$);
      this.subscribeSendLoginResponseOnPlayerAddedToNetwork();

      // Need to send out these stores manually upon joining
      playerStore.added$.subscribe((player) => {
         console.log('player added', player);
         this.sendOutStore(player.id, playerStore);
      });
      playerStore.removed$.subscribe((a) => {
         console.log('player removed', a);
      });
   }

   private sendOutStore<T>(playerId: string, store: Store<T>): void {
      this.service.sendDataStore([playerId], store.getId(), store.getAll());
   }

   // Updates from the network will be merged into the store
   private subscribeNetworkUpdateToStore<T>(store: Store<T>): void {
      this.service.dataStore$
         .pipe(
            map((stores) => stores[store.getId()]),
            filter((storeData) => !!storeData),
            map((storeData) => Array.from(Object.entries(storeData))),
         )
         .subscribe((storeDataEntries) => {
            storeDataEntries
               .filter(([id]) => !!store.get(id))
               .forEach(([id, value]) => {
                  // console.log(`Store ${store.getId()} received entity ${id}:`, value);
                  if (value !== null && value !== undefined) {
                     store.update(id, value as T);
                  }
               });
         });
   }

   // Event in the store will be send out everyone
   private subscribeStoreToNetwork<T>(store: Store<T>, event: Observable<StoreEntity<T>>): void {
      event.subscribe((entity) => {
         this.service.sendDataStoreValue(this.playerStore.getIds(), store.getId(), entity.id, entity.value);
      });
   }

   // Event in the store will be send out everyone except entity id
   private subscribeStoreToNetworkExceptEntity<T>(store: Store<T>, event: Observable<StoreEntity<T>>): void {
      event.subscribe((entity) => {
         this.service.sendDataStoreValue(
            this.playerStore.getIds().filter((id) => id !== entity.id),
            store.getId(),
            entity.id,
            entity.value,
         );
      });
   }

   // Send login response when player added
   private subscribeSendLoginResponseOnPlayerAddedToNetwork(): void {
      this.playerStore.added$.subscribe((entity) => {
         this.service.sendLoginResponse(entity.id, {
            status: LoginStatus.OK,
            player: entity.value,
         } as SuccessfulLoginResponse);
      });
   }
}
