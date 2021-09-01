import './main.scss';
import {Container, Inject, OnlyInstantiableByContainer} from 'typescript-ioc';
import {ClientPlayerManager} from './player/client-player.manager';
import {ClientNetworkManager} from './network/client-network.manager';

@OnlyInstantiableByContainer
class ClientMain {
   public constructor(
      @Inject private readonly player: ClientPlayerManager,
      @Inject private readonly network: ClientNetworkManager,
   ) {
      console.log('Client started.');
   }
}

Container.get(ClientMain);
