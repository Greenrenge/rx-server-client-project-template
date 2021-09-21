import {ClientPlayerService} from './client-player.service';
import {ClientPlayerWrapper} from './client-player.wrapper';
import {PlayerStore} from '../../shared/player/player-store';

describe('ClientPlayerService', () => {
   let service: ClientPlayerService;
   let wrapper: ClientPlayerWrapper;
   let store: PlayerStore;

   beforeEach(() => {
      wrapper = {} as unknown as ClientPlayerWrapper;
      store = {} as unknown as PlayerStore;
      service = new ClientPlayerService(
         wrapper,
         store,
      );
   });

   it('should be created', () => {
      expect(service).toBeDefined();
   });
});
