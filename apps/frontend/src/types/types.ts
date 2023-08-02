export interface IUser {
  id: number;
  username: string;
  email: string;
  access_token: string;
}

export interface IUserData {
  username: string;
  email: string;
  password: string;
}

export interface IResponseUser {
  _id?: number | undefined;
  username: string | undefined;
  email: string | undefined;
  password: string | undefined;
  authentication: boolean | undefined;
  rank: number | undefined;
  avatar: string | undefined;

  // @ManyToMany(() => User)
  // @JoinTable()
  // friends: User[];
  status: string | undefined;
  // Change later
  // @OneToMany()
  // history: History[];

  // @ManyToMany(() => User)
  // @JoinTable()
  // blocked: User[];
  wins: number | undefined;
  loses: number | undefined;
  createdAt: Date | undefined;
}

export interface IResponseUserData {
  token: string;
  user: IResponseUser;
}

// export interface IChannels {
//   id: string;
// }
