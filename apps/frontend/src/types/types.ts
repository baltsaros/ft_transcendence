
export interface IUser {
  id: number;
  intraId: number;
  username: string;
  email: string;
  avatar: string;
  intraToken: string;
}

export interface IUserData {
  username: string;
  email: string;
  avatar: string;
  intraToken: string;
}

export interface IResponseUser {
  _id?: number | undefined;
  intraId: number | undefined;
  username: string | undefined;
  email: string | undefined;
  intraToken: string | undefined;
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

//Interface for the playerProfile
export interface IUserPlayerProfileData {
  username: string | undefined;
  wins: number | undefined;
  loses: number | undefined;
  rank: number | undefined;
  // @OneToMany(() => IMatch)
  // @JoinTable()
  // matches: IMatch[];
}

export interface IResponseUserData {
  token: string;
  user: IResponseUser;
}

export interface IMatch {
  id: number;
  scoreUser: number;
  scoreOpponent: number;
 // @OneToOne(() => User)
  // @JoinTable()
  // opponent: User;
  opponent: string;
  user: string;
}

export interface IMatchData {
  username: string,
  opponent: string,
  scoreUser: number,
  scoreOpponent: number
}

export interface IAddChannelsData {
  name: string;
  mode: string;
  owner: string;
  password: string,
}

export interface IResponseAddChannelData {
  status: boolean;
  message: string;
}
