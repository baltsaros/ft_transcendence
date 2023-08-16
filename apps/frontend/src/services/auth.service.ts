import { instance } from "../api/axios.api";
import { IResponseUserData, IUserData, IUser } from "../types/types";

export const AuthService = {
  async registration(
    userData: IUserData
  ): Promise<IResponseUserData | undefined> {
    const { data } = await instance.post<IResponseUserData>("user", userData);
    return data;
  },
  async login(userData: IUserData): Promise<IUser | undefined> {
    const { data } = await instance.post<IUser>("auth/login", userData);
    return data;
  },
  async getProfile(): Promise<IUser | undefined> {
    const { data } = await instance.get<IUser>("auth/profile");
    if (data) return data;
  },
  async update(userData: IUser): Promise<IUser | undefined> {
    const { data } = await instance.patch<IUser>("user/" + userData['id'].toString(), userData);
    if (data) return data;
  },
  async uploadAvatar(file: File, id: string): Promise<File | any> {
    const formData = new FormData();
    formData.append('file', file);
    console.log('service ' + formData);
    const upload = await instance.post("user/upload/" + id, formData);
    console.log(upload);
    if (upload) return upload;
  },
  async getAvatar(path: string): Promise<any> {
    const avatar = await instance.get("user/avatars/" + path, {responseType: 'arraybuffer'});
    const base64 = btoa(
      new Uint8Array(avatar.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        '',
      ),
    );
    return base64;
  }
};
