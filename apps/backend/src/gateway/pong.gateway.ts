import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
  server: Server;

  handleConnection(client: Socket) {
    // Code de gestion de la connexion
  }

  handleDisconnect(client: Socket) {
    // Code de gestion de la déconnexion
  }

  // Vous pouvez également ajouter des gestionnaires d'événements spécifiques au Pong ici
}
