import { useAppSelector } from "../store/hooks";
import { IUser } from "../types/types";

export const getUser = (): IUser | null => {
  const user = useAppSelector((state) => state.user.user);

  return user;
};