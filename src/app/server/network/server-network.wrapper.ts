import {Inject, Singleton} from 'typescript-ioc';
import {fromEvent, map, mergeMap, Observable, Subject, takeUntil} from 'rxjs';
import {ServerNetworkMessage} from './server-network.model';
import {ServerSocketIoWrapper} from './server-socket-io.wrapper';
import {NetworkMessage} from '../../shared/network/shared-network.model';
import {MsgpackJsonEncoder} from '../../shared/network/msgpack-json-encoder';
import {Socket} from 'socket.io';
import {SocketEvent} from '../../shared/network/shared-socket.wrapper.model';
import {mapServerNetworkMessage} from './server-network.wrapper.utils';
import {filter, share} from 'rxjs/operators';

@Singleton
export class ServerNetworkWrapper {
   private readonly clientsById = new Map<string, Socket>();

   private readonly clientConnectedIdSubject = new Subject<string>();
   readonly clientConnectedId$ = this.clientConnectedIdSubject.asObservable();

   private readonly clientDisconnectedIdSubject = new Subject<string>();
   readonly clientDisconnectedId$ = this.clientDisconnectedIdSubject.asObservable();

   private readonly clientDataSubject = new Subject<ServerNetworkMessage>();
   readonly clientData$ = this.clientDataSubject.asObservable();

   constructor(
      @Inject private readonly wrapper: ServerSocketIoWrapper,
      @Inject private readonly encoder: MsgpackJsonEncoder<NetworkMessage[]>,
   ) {
      wrapper.connected$
         .subscribe((client) => this.addClient(client));
   }

   send(clientId: string, message: NetworkMessage): void {
      this.clientsById.get(clientId)?.emit(SocketEvent.DATA, this.encoder.encode([message]));
   }

   disconnect(clientId: string): void {
      const client = this.clientsById.get(clientId);
      if (client) {
         client.disconnect();
         this.clientsById.delete(clientId);
         this.clientDisconnectedIdSubject.next(clientId);
      }
   }

   private addClient(client: Socket): void {
      this.clientsById.set(client.id, client);
      this.subscribeClientData(client);
      this.subscribeClientDisconnect(client);
      this.clientConnectedIdSubject.next(client.id);
   }

   private subscribeClientData(client: Socket): void {
      fromEvent(client, SocketEvent.DATA)
         .pipe(
            takeUntil(this.clientDisconnected(client.id)),
            map((buffer: Buffer) => this.encoder.decode(buffer)),
            mergeMap(x => x),
            map((message) => mapServerNetworkMessage(message, client.id)),
         )
         .subscribe((message) => this.clientDataSubject.next(message));
   }

   private subscribeClientDisconnect(client: Socket): void {
      fromEvent(client, SocketEvent.DISCONNECT)
         .pipe(takeUntil(this.clientDisconnected(client.id)))
         .subscribe(() => this.disconnect(client.id));
   }

   private clientDisconnected(clientId: string): Observable<unknown> {
      return this.clientDisconnectedId$.pipe(
         filter(id => id === clientId),
         share(),
      )
   }
}
