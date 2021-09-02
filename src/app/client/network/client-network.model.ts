import {Observable} from 'rxjs';
import {NetworkEvent} from '../../shared/network/shared-network.model';

interface AbstractClientNetwork<T> {
   readonly connected$: Observable<void>;
   readonly disconnected$: Observable<void>;
   readonly data$: Observable<T>;

   isConnected(): boolean;

   connect(host: string): void;

   disconnect(): void;
}

export interface ClientEventNetwork<T> extends AbstractClientNetwork<T> {
   send(event: NetworkEvent, data: T): void;
}

export interface ClientNetwork<T> extends AbstractClientNetwork<T> {
   send(data: T): void;
}

export interface ClientNetworkUsingOnlyFunctions<T> {
   onConnected(): Observable<void>;

   onDisconnected(): Observable<void>;

   onData(): Observable<T>;

   isConnected(): boolean;

   connect(host: string): void;

   disconnect(): void;

   send(data: T): void;
}
