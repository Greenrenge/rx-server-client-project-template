import {ClientPlayerManager} from './client-player.manager';
import {ClientPlayerService} from './client-player.service';
import {ClientNetworkService} from '../network/client-network.service';
import {Subject} from 'rxjs';

jest.mock('../utils/worker-url.utils', () => ({
   clientNetworkThreadUrl: 'workerURL',
}));

describe('ClientPlayerManager', () => {
   let manager: ClientPlayerManager;
   let service: ClientPlayerService;
   let network: ClientNetworkService;

   beforeEach(() => {
      service = {} as unknown as ClientPlayerService;
      network = {
         loginOk$: new Subject().asObservable(),
      } as unknown as ClientNetworkService;
      manager = new ClientPlayerManager(
         service,
         network,
      );
   });

   it('should be created', () => {
      expect(manager).toBeDefined();
   });
});
