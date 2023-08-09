import { FC } from "react";
import { useState } from "react";
import ftLogo from "../assets/42_Logo.svg";
import { NavLink } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { RootState } from "../store/store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useAuth } from "../hooks/useAuth";

const Home: FC = () => {
  // const user = useAppSelector((state: RootState) => state.user.user);
  const isAuth = useAuth();
  const dispatch = useAppDispatch();
  const [count, setCount] = useState(0);
  // const decoded = jwtDecode<any>(cookies.jwt_token);
  // console.log(decoded);

  return (
    <>
      {!isAuth ? (
        <div className="flex flex-col items-center justify-center">
          <NavLink to="http://localhost:3000/api/auth/redir">
            <img
              src={ftLogo}
              className="logo"
              alt="42 logo"
              style={{ width: "150px", height: "150px" }}
            />
          </NavLink>
          Please, log in with 42 account
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <a href="https://profile.intra.42.fr/" target="_blank">
            <img src={ftLogo} className="logo" alt="42 logo" />
          </a>
          <h1>Under construction...</h1>
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p className="read-the-docs">Click on the 42 to be redirected...</p>
        </div>
      )}
    </>
  );
};

export default Home;
