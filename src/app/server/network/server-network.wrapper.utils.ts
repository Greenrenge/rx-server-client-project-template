import {NetworkMessage} from '../../shared/network/shared-network.model';
import {ServerNetworkMessage} from './server-network.model';

export const mapServerNetworkMessage = (message: NetworkMessage, clientId: string): ServerNetworkMessage => ({
   ...message,
   clientId,
});
