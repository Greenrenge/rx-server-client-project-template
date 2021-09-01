import {Inject, Singleton} from 'typescript-ioc';
import {ClientNetworkBufferedWrapper} from './client-network-buffered.wrapper';
import {ClientConfig} from '../config/client-config';

@Singleton
export class ClientNetworkService {
   public constructor(
      @Inject private readonly wrapper: ClientNetworkBufferedWrapper,
   ) {
      this.connect(ClientConfig.SERVER_HOSTS[0].url);
   }

   connect(host: string): void {
      this.wrapper.connect(host);
   }
}
