import './main.scss';
import {Container, Inject} from 'typescript-ioc';
import {ServerPlayerManager} from './player/server-player.manager';

class ServerMain {
   public constructor(
      @Inject private readonly player: ServerPlayerManager,
   ) {
      console.log('Server started.');
   }
}

Container.get(ServerMain);

setInterval(() => {
   // Keep running
}, 100000);
