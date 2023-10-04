import { instance } from "../api/axios.api";
import {
  IResponseUserData,
  IUserData,
  IUser,
  IResponseUser,
} from "../types/types";

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
  async getProfile(): Promise<IResponseUser | undefined> {
    const { data } = await instance.get<IResponseUser>("auth/profile");
    if (data) return data;
  },
  async update(userData: IResponseUser): Promise<IResponseUser | undefined> {
    const { data } = await instance.patch<IResponseUser>(
      "user/" + userData["id"].toString(),
      userData
    );
    if (data) return data;
  },
  async uploadAvatar(file: File, id: string): Promise<File | any> {
    const formData = new FormData();
    formData.append("file", file);
    const upload = await instance.post("user/upload/" + id, formData);
    if (upload) return upload;
  },
  async getAvatar(path: string): Promise<any> {
    const avatar = await instance.get("user/avatars/" + path, {
      responseType: "arraybuffer",
    });
    const base64 = btoa(
      new Uint8Array(avatar.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );
    return base64;
  },
  async generateSecret(): Promise<string> {
    const secret = await instance.get("auth/2fa-generate");
    return secret.data;
  },
  async generateQrCode(intraId: string): Promise<any> {
    const otpauthUrl = await instance.get("auth/QrCode-generate/" + intraId);
    return otpauthUrl.data;
  },
};
