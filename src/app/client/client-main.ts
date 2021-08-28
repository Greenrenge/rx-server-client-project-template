import './main.scss';
import {Container, Inject} from 'typescript-ioc';
import {ClientPlayerManager} from './player/client-player.manager';

class ClientMain {
   public constructor(
      @Inject private readonly player: ClientPlayerManager,
   ) {
      console.log('Client started.');
   }
}

Container.get(ClientMain);
