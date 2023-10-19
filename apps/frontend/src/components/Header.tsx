import { FC, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUserFriends } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { useAppDispatch } from "../store/hooks";
import { logout } from "../store/user/userSlice";
import { removeTokenFromLocalStorage } from "../helpers/localstorage.helper";
import { toast } from "react-toastify";
import ftLogo from "../assets/42_Logo.svg";
import Cookies from "js-cookie";
import { getAvatar } from "../hooks/getAvatar";
import { getUsername } from "../hooks/getUsername";
import { getUser } from "../hooks/getUser";
import FriendInvitations from "./FriendInvitations";
import FriendList from "./FriendList";
import { AuthService } from "../services/auth.service";
import { Menu, MenuButton, MenuHeader } from "@szhsin/react-menu";

const Header: FC = () => {
  const isAuth = useAuth();
  const user = getUser();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const avatar = getAvatar();
  const username = getUsername();

  // const [avatar, setAvatar] = useState<any>({ source: "" });
  // const [filename, setFilename] = useState<string>("");

  // const checkAvatar = async () => {
  //   console.log('user: ' + user);
  //   if (user?.avatar) setFilename(user?.avatar);
  //   console.log('filename: ' + filename);
  //   if (filename.includes("https")) {
  //     setAvatar({ source: filename });
  //     return ;
  //   }
  //   const base64 = await AuthService.getAvatar(filename);
  //   setAvatar({ source: "data:;base64," + base64 });
  // }

  const logoutHandler = async () => {
    dispatch(logout());
    await AuthService.updateStatus("offline");
    removeTokenFromLocalStorage("token");
    toast.success("Bye!");
    Cookies.remove("jwt_token");
    Cookies.remove("username");
    navigate("/");
  };

  // useEffect(() => {
  //   checkAvatar();
  //   console.log('ava: ' + user?.avatar);
  //   console.log('source: ' + avatar.source);
  // }, []);

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
    <header className="flex items-center p-4 pr-10 shadow-sm bg-gray-500 backdrop-blur-sm">
      <img
        src={ftLogo}
        className="logo"
        alt="42 logo"
        style={{ width: "70px", height: "70px" }}
      />
      <NavLink to={"/"} className="py-2 text-white/50 hover:text-white">
        19 PONG GAME
      </NavLink>
      {isAuth && (
        <nav className="ml-auto mr-10">
          <ul className="flex items-center gap-5">
            <li>
              {avatar.length ? (
                <img
                  src={avatar}
                  style={{ width: "70px", height: "70px" }}
                  alt="[AVA]"
                />
              ) : (
                "[AVATAR]"
              )}
            </li>
            <div>
              <Menu
                direction={"bottom"}
                arrow={true}
                align={"center"}
                menuButton={
                  <MenuButton className={"py-2 text-white/50 hover:text-white"}>
                    {username}
                  </MenuButton>
                }
              >
                <div className="bg-gray-500 text-black">
                  <MenuHeader>
                    <li>
                      <NavLink
                        // to={"player/" + Cookies.get('username')}
                        to={"player/" + username}
                        className={({ isActive }) =>
                          isActive
                            ? "py-2 text-white hover:text-white/50"
                            : "text-white/50 hover:text-white"
                        }
                      >
                        Statistics
                      </NavLink>
                    </li>
                  </MenuHeader>
                  <MenuHeader>
                    <li>
                      <NavLink
                        // to={"player/" + Cookies.get('username')}
                        to={"edit"}
                        className={({ isActive }) =>
                          isActive
                            ? "py-2 text-white hover:text-white/50"
                            : "text-white/50 hover:text-white"
                        }
                      >
                        Edit
                      </NavLink>
                    </li>
                  </MenuHeader>
                </div>
              </Menu>
            </div>
            <li>
              <FriendList />
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
