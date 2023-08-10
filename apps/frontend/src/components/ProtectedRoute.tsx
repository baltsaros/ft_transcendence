import { FC } from "react";
import { useAuth } from "../hooks/useAuth";
import leo from "../assets/pope-leo-x-after-raphael.jpg";

interface Props {
  children: JSX.Element;
}

export const ProtectedRoute: FC<Props> = ({ children }) => {
  const isAuth = useAuth();
  return (
    <>
      {isAuth ? (
        children
      ) : (
        <div className="mt 20 flex flex-col items-center justify-center gap-5">
          <br/>
          <h1 className="text-2xl">To view this page you must be logged in</h1>
          <img className="w-1/2" src={leo} alt="No access" />
        </div>
      )}
    </>
  );
};
