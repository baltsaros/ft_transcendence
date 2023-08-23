import { io, Socket } from 'socket.io-client';
import { ISocketService } from '../types/types'

class SocketService implements ISocketService {
    socket: Socket;

    constructor() {
        this.socket = io('http://localhost:3000');
        this.socket.on('connect', () => {
            console.log("Connect to WebSocket server");
        })
        this.socket.on('disconnect', () => {
            console.log("Disonnect to WebSocket server");
        })
    }
    
    /* Defining method to emit an event to the server */
    emit(event: string, data: any) {
        this.socket.emit(event, data);
    }

    on(event: string, data: any) {
        this.socket.on(event, data);
    }

    off(event: string, data:any) {
        this.socket.off(event, data);
    }
}

/* singleton pattern */
export default new SocketService();