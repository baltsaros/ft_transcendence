import { User } from "src/user/entities/user.entity";
import { Profile } from "passport-42"

export interface IUser {
  id: string;
  intra_id: number;
  username: string;
  email: string;
  avatar: string;
  access_token: string;
}

export type Done = (err: Error, profile: Profile) => void;
