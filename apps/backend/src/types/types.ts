import { User } from "src/user/entities/user.entity";
import { Profile } from "passport-42"

export interface IUser {
  id: number;
  username: string;
  avatar: string;
  intraId: number;
  email: string;
  intraToken: string;
}

export type Done = (err: Error, profile: Profile) => void;
