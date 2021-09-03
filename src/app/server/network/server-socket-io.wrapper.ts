import {fromEvent, Subject} from 'rxjs';
import Http from 'http';
import {Server, ServerOptions, Socket} from 'socket.io';
import {SharedSocketWrapper} from '../../shared/network/shared-socket.wrapper';
import {SocketEvent} from '../../shared/network/shared-socket.wrapper.model';
import {SharedConfig} from '../../shared/config/shared-config';

export class ServerSocketIoWrapper extends SharedSocketWrapper {
   private readonly connectedSubject = new Subject<Socket>();
   readonly connected$ = this.connectedSubject.asObservable();

   private readonly httpServer: Http.Server;
   private readonly socketServer: Server;

   constructor() {
      super();
      this.httpServer = Http.createServer();
      this.socketServer = new Server(this.httpServer, {cors: true} as Partial<ServerOptions>);
      this.initListeners();
      this.httpServer.listen(SharedConfig.SERVER_SOCKET_PORT);
      console.log(`Socket listening on port ${SharedConfig.SERVER_SOCKET_PORT}`);
   }

   private initListeners(): void {
      fromEvent(this.socketServer, SocketEvent.CONNECT)
         .subscribe((socket: Socket) => this.connectedSubject.next(socket));
   }
}
