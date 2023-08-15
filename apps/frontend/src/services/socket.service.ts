import io, { Socket } from 'socket.io-client';
import { ISocketService } from '../types/types'

class SocketService implements ISocketService {
    socket: Socket;

    constructor() {
        this.socket = io('http:://localhost:3000');
    }

    /* Definin method to emit an event to the server */
    emit(event: string, data: any) {
        this.socket.emit(event, data);
    }
}

/* singleton pattern */
export default new SocketService();