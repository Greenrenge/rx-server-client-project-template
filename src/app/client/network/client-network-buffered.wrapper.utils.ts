import {NetworkEvent, NetworkMessage, NetworkPayload} from '../../shared/network/shared-network.model';

export const mapNetworkMessages = (data: [NetworkEvent, NetworkPayload][]): NetworkMessage[] =>
   data.map(([event, value]) => ({event, value} as NetworkMessage))
