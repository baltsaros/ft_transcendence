import { io, Socket } from 'socket.io-client';

class WebSocketService {
    private socket: Socket;
  constructor() {
    this.socket = io('ws://localhost:3000');
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  on(event: string, data: any) {
    this.socket.on(event, data);
  }

  off(event: string) {
    this.socket.off(event);
  }

  disconnect() {
    this.socket.close();
  }
}

export default WebSocketService;
