import {Container, Inject, OnlyInstantiableByContainer} from 'typescript-ioc';
import {ServerPlayerManager} from './player/server-player.manager';

@OnlyInstantiableByContainer
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
