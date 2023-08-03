import { Injectable } from "@nestjs/common";
import { Profile } from 'passport-42'

@Injectable()
export class DataStorageService {
  private accessToken: string;
  private id: number;
  private avatar: string;

  setData(token: string, profile: Profile): void {
    this.accessToken = token;
    this.id = profile.id;
    this.avatar = profile._json.image.link;
    console.log("what was set: " + this.id + " " + this.avatar);
  }
  
  getData(): any {
    return { accessToken: this.accessToken, intra_id: this.id, avatar: this.avatar };
  }
  
  getAccessToken(): string {
    return this.accessToken;
  }
}