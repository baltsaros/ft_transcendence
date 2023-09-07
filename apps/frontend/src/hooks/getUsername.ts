import { useAppSelector } from "../store/hooks";

export const getUsername = (): string => {
  const username = useAppSelector((state) => state.user.username);

  return username;
};