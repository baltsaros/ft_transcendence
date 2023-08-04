import { User } from "src/user/entities/user.entity";
import { Profile } from "passport-42"

export interface IUser {
  id: string;
  username: string;
  avatar: string;
  intraId: string;
  email: string;
  intraToken: string;
}

export type Done = (err: Error, profile: Profile) => void;
