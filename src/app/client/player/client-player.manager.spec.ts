import {ClientPlayerManager} from './client-player.manager';
import {ClientPlayerService} from './client-player.service';

describe('ClientPlayerManager', () => {
   let manager: ClientPlayerManager;
   let service: ClientPlayerService;

   beforeEach(() => {
      service = {} as unknown as ClientPlayerService;
      manager = new ClientPlayerManager(
         service,
      );
   });

   it('should be created', () => {
      expect(manager).toBeDefined();
   });
});
