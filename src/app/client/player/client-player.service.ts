import {Inject, Singleton} from 'typescript-ioc';
import {ClientPlayerWrapper} from './client-player.wrapper';

@Singleton
export class ClientPlayerService {
   public constructor(@Inject private readonly wrapper: ClientPlayerWrapper) {
   }
}
