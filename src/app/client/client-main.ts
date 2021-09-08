import './main.scss';
import {Container, Inject, OnlyInstantiableByContainer} from 'typescript-ioc';
import {ClientPlayerManager} from './player/client-player.manager';
import {ClientNetworkManager} from './network/client-network.manager';
import {ClientStoreManager} from './store/client-store.manager';

@OnlyInstantiableByContainer
class ClientMain {
   public constructor(
      @Inject private readonly player: ClientPlayerManager,
      @Inject private readonly network: ClientNetworkManager,
      @Inject private readonly store: ClientStoreManager,
   ) {
      console.log('Client started.');
   }
}

Container.get(ClientMain);
