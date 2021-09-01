import {SharedConfig} from '../../shared/config/shared-config';

export interface ServerHost {
   readonly url: string;
   readonly name: string;
}

// Set production (or for both production and development) properties here,
// but import them via ServerConfig
export class CommonClientConfig extends SharedConfig {
   static readonly ASSET_FOLDER: string = 'asset/';
   static readonly SERVER_HOSTS: ServerHost[] = [
      {
         url: 'https://the-big-cheese-eu.herokuapp.com',
         name: 'Europe',
      },
      {
         url: 'https://the-big-cheese-us.herokuapp.com',
         name: 'North America',
      },
   ];
}
