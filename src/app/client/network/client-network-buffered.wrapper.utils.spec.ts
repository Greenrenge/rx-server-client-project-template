import {mapNetworkMessages} from './client-network-buffered.wrapper.utils';
import {NetworkEvent, NetworkMessage, NetworkPayload} from '../../shared/network/shared-network.model';

describe('ClientNetworkBufferedWrapperUtils', () => {
   describe('mapNetworkMessages', () => {
      it('should map array to object', () => {
         const data: [NetworkEvent, NetworkPayload][] = [[NetworkEvent.STORE, {}]];
         const result = mapNetworkMessages(data);
         expect(result).toEqual([{
            event: NetworkEvent.STORE,
            value: {},
         }] as NetworkMessage[])
      });
   });
});
