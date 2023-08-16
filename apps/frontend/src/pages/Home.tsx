import { FC, useEffect } from "react";
import { useState } from "react";
import ftLogo from "../assets/42_Logo.svg";
import { NavLink } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { RootState } from "../store/store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useAuth } from "../hooks/useAuth";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

const Home: FC = () => {
  // const user = useAppSelector((state: RootState) => state.user.user);
  const isAuth = useAuth();
  const dispatch = useAppDispatch();
  const [count, setCount] = useState(0);
  const token = Cookies.get('jwt_token');
 


  useEffect(() => {
    if (token){
      const decoded = jwtDecode<any>(Cookies.get('jwt_token')!)
      if (decoded)
        Cookies.set('username', decoded.username, {sameSite: "none", secure: true});
    }
  },  [])

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
		  <div className="flex items-center justify-center">
		    <Link to="/game">
              <button className="flex flex-col px-20 py-20 bg-green-800 text-black text-4xl">Find a game</button>
            </Link>
		  </div>
          <p className="read-the-docs">Click on the 42 to be redirected...</p>
          <div className="flex h-screen items-center justify-center">
            <Link to="/chat">
              <button className="flex flex-col px-20 py-20 bg-gray-500 text-black text-4xl">GO TO CHAT</button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
