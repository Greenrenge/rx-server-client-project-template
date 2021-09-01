export interface NetworkMessage<T = NetworkPayload> {
   event: NetworkEvent;
   value: T;
}

export enum NetworkEvent {
   STORE,
}

export interface NetworkPayload {
}

export type NetworkDataType = NetworkMessage[];
