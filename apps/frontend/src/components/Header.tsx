import { FC, useEffect, useState } from "react";
import { RootState } from "../store/store";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/user/userSlice";
import { removeTokenFromLocalStorage } from "../helpers/localstorage.helper";
import { toast } from "react-toastify";
import ftLogo from "../assets/42_Logo.svg";
import Cookies from "js-cookie";

const Header: FC = () => {
  // const [username, setUsername] = useState(user?.username);
  const isAuth = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const logoutHandler = () => {
    dispatch(logout());
    removeTokenFromLocalStorage("token");
    toast.success("Bye!");
    Cookies.remove("jwt_token");
    navigate("/");
  };
  const user = useAppSelector((state: RootState) => state.user.user);

  // useEffect(() => {
  // setUsername(user?.username);
  // // const user = useAppSelector((state: RootState) => state.user.user);
  // }, [user]);

  // const UserComponent = async () => {
  //   // const [username, setUsername] = useState('');
  //   const data = await AuthService.getProfile();
  //   console.log('frotend data: ' + data?.avatar);
  //   console.log('frotend data: ' + data?.username);
  //   if (data?.avatar)
  //     setAvatar(data?.avatar);
  //   // console.log(data);
  // };

  return (
    <header className="flex items-center p-4 shadow-sm bg-gray-500 backdrop-blur-sm">
      <img
        src={ftLogo}
        className="logo"
        alt="42 logo"
        style={{ width: "70px", height: "70px" }}
      />
      <NavLink to={"/"} className="py-2 text-white/50 hover:text-white">
        19 POGN GAME
      </NavLink>
      {isAuth && (
        <nav className="ml-auto mr-10">
          <ul className="flex items-center gap-5">
            <li>
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  style={{ width: "70px", height: "70px" }}
                  alt="AVA"
                />
              ) : (
                "AVATAR"
              )}
            </li>
            <li>
              <NavLink
                to={"player"}
                className={({ isActive }) =>
                  isActive
                    ? "py-2 text-white hover:text-white/50"
                    : "text-white/50"
                }
              >
                {user?.username}
              </NavLink>
            </li>
          </ul>
        </nav>
      )}
      {isAuth ? (
        <button className="btn btn-red" onClick={logoutHandler}>
          <span>Log out</span>
          <FaSignOutAlt />
        </button>
      ) : (
        <Link
          className="py-2 text-white/50 hover:text-white ml-auto"
          to={"http://localhost:3000/api/auth/redir"}
        >
          42 API
        </Link>
      )}
    </header>
  );
};

export default Header;
