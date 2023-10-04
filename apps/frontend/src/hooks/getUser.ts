import { useAppSelector } from "../store/hooks";
import { IResponseUser } from "../types/types";

export const getUser = (): IResponseUser | null => {
  const user = useAppSelector((state) => state.user.user);

  return user;
};