import { FC, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { useAppDispatch } from "../store/hooks";
import { logout } from "../store/user/userSlice";
import { removeTokenFromLocalStorage } from "../helpers/localstorage.helper";
import { toast } from "react-toastify";
import ftLogo from "../assets/42_Logo.svg";
import { useSelector } from "react-redux";

const Header: FC = () => {
  const isAuth = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const avatar = '';

  const logoutHandler = () => {
    dispatch(logout());
    removeTokenFromLocalStorage("token");
    toast.success("Bye!");
    navigate("/");
  };

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
        <img src={ftLogo} className="logo" alt="42 logo" style={{ width: '70px', height: '70px' }}/> 
        <NavLink
          to={"/"}
          className="py-2 text-white/50 hover:text-white"
        >
        19 POGN GAME
        </NavLink>
      {isAuth && (
        <nav className="ml-auto mr-10">
          <ul className="flex items-center gap-5">
            <li>{avatar ? <img src={avatar} style={{width: '70px', height: '70px'}} alt="AVA"/> : "AVATAR"}</li>
            <li>
              <NavLink
                to={"player"}
                className={({ isActive }) =>
                  isActive ? "py-2 text-white hover:text-white/50" : "text-white/50"
                }
              >
                Player Name
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
        <Link className="py-2 text-white/50 hover:text-white ml-auto" to={"auth"}>
          Sign In
        </Link>
      )}
    </header>
  );
};

export default Header;
