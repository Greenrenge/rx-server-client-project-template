import {SharedSocketWrapper} from '../../shared/network/shared-socket.wrapper';
import {Singleton} from 'typescript-ioc';
import {ClientNetwork} from './client-network.model';
import {fromEvent, Subject, takeUntil} from 'rxjs';
import {io, Socket} from 'socket.io-client';
import {SocketEvent} from '../../shared/network/shared-socket.wrapper.model';

@Singleton
export class ClientSocketIoWrapper<T> extends SharedSocketWrapper implements ClientNetwork<T> {
   private readonly connectedSubject = new Subject<void>();
   readonly connected$ = this.connectedSubject.asObservable();

   private readonly disconnectedSubject = new Subject<void>();
   readonly disconnected$ = this.disconnectedSubject.asObservable();

   private readonly dataSubject = new Subject<T>();
   readonly data$ = this.dataSubject.asObservable();

   private readonly disconnectSubject = new Subject<void>();
   readonly disconnect$ = this.disconnectSubject.asObservable();

   private socket?: Socket;

   connect(host: string): void {
      this.disconnect();
      this.socket = io(host, {autoConnect: false});
      this.initListeners();
      this.socket.connect();
   }

   disconnect(): void {
      if (this.socket) {
         this.socket.disconnect();
         this.socket = undefined;
         this.disconnectSubject.next();
      }
   }

   private initListeners(): void {
      if (this.socket) {
         fromEvent(this.socket, SocketEvent.CONNECT)
            .pipe(takeUntil(this.disconnect$))
            .subscribe(() => this.connectedSubject.next());
         fromEvent(this.socket, SocketEvent.DISCONNECT)
            .pipe(takeUntil(this.disconnect$))
            .subscribe(() => this.disconnectedSubject.next());
         fromEvent(this.socket, SocketEvent.DATA)
            .pipe(takeUntil(this.disconnect$))
            .subscribe((data: T) => this.dataSubject.next(data));
      }
   }

   isConnected(): boolean {
      return this.socket?.connected ?? false;
   }

   send(data: T): void {
      this.socket?.emit(SocketEvent.DATA, data);
   }
}
