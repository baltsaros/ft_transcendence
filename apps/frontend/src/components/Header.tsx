import { FC } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { useAppDispatch } from "../store/hooks";
import { logout } from "../store/user/userSlice";
import { removeTokenFromLocalStorage } from "../helpers/localstorage.helper";
import { toast } from "react-toastify";
import ftLogo from "../assets/42_Logo.svg";

const Header: FC = () => {
  const isAuth = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout());
    removeTokenFromLocalStorage("token");
    toast.success("Bye!");
    navigate("/");
  };

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
            <li>[Player Avatar]</li>
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
