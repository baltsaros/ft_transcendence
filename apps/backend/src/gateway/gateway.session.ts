import { Injectable } from "@nestjs/common";
import { IUserSocket } from "src/types/types";

@Injectable()
export class GatewaySessionManager {
    private readonly userMapping: Map<string, IUserSocket> = new Map();
    getSocket(username: string){
        return this.userMapping.get(username);
    }

    setSocket(username: string, socket: IUserSocket){
        this.userMapping.set(username, socket);
        console.log('userMapping:', this.userMapping);
    }

    removeSocket(username: string){
        this.userMapping.delete(username);
    }
}