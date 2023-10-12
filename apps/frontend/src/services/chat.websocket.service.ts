import { io, Socket } from 'socket.io-client';

class ChatWebSocketService {
	private socket: Socket;
	constructor(username: string) {
    this.socket = io('ws://localhost:3000/chat', {
      query: {
        username: username,
      },
    });
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

export default ChatWebSocketService;

