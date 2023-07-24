import { FC } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { useAppDispatch } from "../store/hooks";
import { logout } from "../store/user/userSlice";
import { removeTokenFromLocalStorage } from "../helpers/localstorage.helper";
import { toast } from "react-toastify";

const Header: FC = () => {
  const isAuth = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate()

  const logoutHandler = () => {
    dispatch(logout());
    removeTokenFromLocalStorage('token');
    toast.success('Bye!')
    navigate('/');
  }

  return (
    <header>
      {isAuth && (
        <nav>
          <ul>
            <li>
              <NavLink to={"/"}>19 POGN GAME</NavLink>
            </li>
            <li>Player Avatar</li>
            <li>
              <NavLink to={"player"}>Player Name</NavLink>
            </li>
          </ul>
        </nav>
      )}
      {isAuth ? (
        <button className="brn brn-red" onClick={logoutHandler}>
          <span>Log out</span>
          <FaSignOutAlt />
        </button>
      ) : (
        <Link to={"auth"}>Sign In</Link>
      )}
    </header>
  );
};

export default Header;
