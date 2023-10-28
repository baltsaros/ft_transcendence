import { FC, useEffect } from "react";
import ftLogo from "../assets/42_Logo.svg";
import jwtDecode from "jwt-decode";
import { useAuth } from "../hooks/useAuth";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";


const Home: FC = () => {
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
			<div className="grid grid-cols-3 gap-28">
				<div className="col-start-2 justify-self-center grid grid-rows-4 gap-10">
					<div></div>
					<div className="row-span-1">
						<a href="http://localhost:3000/api/auth/redir" className="relative">
							<div className="rounded-md bg-gray-500 p-4 group-hover:bg-opacity-70 transition-bg-opacity duration-300">
								<img src={ftLogo} className="logo w-40 h-40" alt="42 logo" />
								<p className="text-white text-lg font-bold">LOG IN</p>
							</div>
						</a>
					</div>
				</div>
			</div>
		</div>
      ) : (
		<div className=" grid grid-cols-3 gap-28">
			<div className="col-start-2 justify-self-center grid grid-rows-4 gap-10">
			<div/>
			<div className="row-span-1">
				<Link to="/game">
					<button className="w-64 h-32 bg-gray-500 hover:bg-gray-600 text-gray-200 text-4xl font-bold rounded-lg transition-colors duration-300">PLAY</button>
				</Link>
			</div>
			 <div className="row-span-1">
				<Link to="/chat">
					<button className="w-64 h-32 bg-gray-500 hover:bg-gray-600 text-gray-200 text-4xl font-bold rounded-lg transition-colors duration-300">
						CHAT
					</button>
				</Link>
			</div>
			</div>
		</div>

      )}
    </>
  );
};

export default Home;