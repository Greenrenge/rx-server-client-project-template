import {Inject, Singleton} from 'typescript-ioc';
import {ServerPlayerService} from './server-player.service';
import {ServerNetworkService} from '../network/server-network.service';
import {ServerConfig} from '../config/server-config';
import {LoginStatus} from '../../shared/network/shared-network.model';

@Singleton
export class ServerPlayerManager {
   public constructor(
      @Inject private readonly service: ServerPlayerService,
      @Inject private readonly network: ServerNetworkService,
   ) {
      network.loginRequest$.subscribe((message) => {
         if (service.getNrOfPlayers() < ServerConfig.MAX_NR_OF_PLAYERS) {
            service.add(message.clientId, message.value.userName);
            // Login OK message will be sent by ServerNetworkManager after adding the player to the store
         } else {
            this.network.sendLoginResponse(message.clientId, {
               status: LoginStatus.DENIED_SERVER_IS_FULL,
            });
         }
      });
      network.clientDisconnectedId$.subscribe(id => {
         service.remove(id);
      })
   }
}
