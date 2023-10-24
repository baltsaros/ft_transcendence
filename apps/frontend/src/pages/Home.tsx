import { FC, useEffect, useRef } from "react";
import ftLogo from "../assets/42_Logo.svg";
import jwtDecode from "jwt-decode";
import { useAuth } from "../hooks/useAuth";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";


const Home: FC = () => {
  // const user = useAppSelector((state: RootState) => state.user.user);
  const isAuth = useAuth();
  const token = Cookies.get('jwt_token');

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode<any>(Cookies.get("jwt_token")!);
      if (decoded)
        Cookies.set("username", decoded.username, {
          sameSite: "none",
          secure: true,
        });
    }
  }, []);

  return (
    <>
      {!isAuth ? (
        <div className="flex flex-col items-center justify-center">
          <a href="http://localhost:3000/api/auth/redir">
            <img
              src={ftLogo}
              className="logo"
              alt="42 logo"
              style={{ width: "150px", height: "150px" }}
            />
          </a>
          Please, log in with 42 account
        </div>
      ) : (
          <div className=" grid grid-cols-3 gap-28">
            <div className="col-start-2 justify-self-center grid grid-rows-4 gap-10">
              <div/>
			  <div>
                <Link to="/game">
                  <button className="w-64 h-32 bg-gray-500 text-center text-black text-4xl">PLAY</button>
                </Link>
              </div>
              <div>
                <Link to="/chat">
                  <button className="w-64 h-32 bg-gray-500 text-center text-black text-4xl">CHAT</button>
                </Link>
              </div>
            </div>
          </div>
      )}
    </>
  );
};

export default Home;