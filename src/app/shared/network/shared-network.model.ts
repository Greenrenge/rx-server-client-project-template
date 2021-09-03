export interface NetworkMessage<T = NetworkPayload> {
   event: NetworkEvent;
   value: T;
}

export enum NetworkEvent {
   LOGIN,
   STORE,
}

export interface NetworkPayload {
}

export type NetworkDataType = NetworkMessage[];

//

export interface LoginRequest {
   userName: string;
}

export interface LoginResponse {
   status: LoginStatus;
}

export enum LoginStatus {
   OK,
   DENIED_SERVER_IS_FULL,
}

export interface SuccessfulLoginResponse extends LoginResponse {
   // Player, etc.
}
