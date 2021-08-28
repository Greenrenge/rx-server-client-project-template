import {ClientPlayerService} from './client-player.service';
import {ClientPlayerWrapper} from './client-player.wrapper';

describe('ClientPlayerService', () => {
   let service: ClientPlayerService;
   let wrapper: ClientPlayerWrapper;

   beforeEach(() => {
      wrapper = {} as unknown as ClientPlayerWrapper;
      service = new ClientPlayerService(
         wrapper,
      );
   });

   it('should be created', () => {
      expect(service).toBeDefined();
   });
});
