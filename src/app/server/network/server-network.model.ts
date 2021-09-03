import {NetworkMessage, NetworkPayload} from 'src/app/shared/network/shared-network.model';

export interface ServerNetworkMessage<T = NetworkPayload> extends NetworkMessage<T> {
   clientId: string;
}
