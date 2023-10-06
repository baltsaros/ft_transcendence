import { useAppSelector } from "../store/hooks";

export const getAvatar = (): string => {
  const avatar = useAppSelector((state) => state.user.avatar);

  return avatar;
};