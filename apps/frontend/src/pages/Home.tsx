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
import FriendList from "../components/FriendList";
import userSlice from "../store/user/userSlice";

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
          <div className="flex flex-row grid justify-center items-center">
            <div className="grid grid-rows-2 m-auto gap-10">
              <div>
                <Link to="/">
                  <button className="w-96 h-40 bg-gray-500 text-center text-black text-4xl">PLAY</button>
                </Link>
              </div>

              <div>
                <Link to="/chat">
                  <button className="w-96 h-40 bg-gray-500 text-center text-black text-4xl">GO TO CHAT</button>
                </Link>
              </div>
            </div>
            <FriendList />
          </div>
      )}
    </>
  );
};

export default Home;
