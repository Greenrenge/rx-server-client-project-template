import {Container, Inject, OnlyInstantiableByContainer} from 'typescript-ioc';
import {ServerPlayerManager} from './player/server-player.manager';
import {ServerNetworkManager} from './network/server-network.manager';
import {ServerStoreManager} from './store/server-store.manager';

@OnlyInstantiableByContainer
class ServerMain {
   public constructor(
      @Inject private readonly player: ServerPlayerManager,
      @Inject private readonly network: ServerNetworkManager,
      @Inject private readonly store: ServerStoreManager,
   ) {
      console.log('Server started.');
   }
}

Container.get(ServerMain);

setInterval(() => {
   // Keep running
}, 100000);
