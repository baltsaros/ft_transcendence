// import ftLogo from './assets/42_Logo.svg'
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import { useAppDispatch } from "./store/hooks";
import {
  getTokenFromLocalStorage,
  setTokenToLocalStorage,
} from "./helpers/localstorage.helper";
import { AuthService } from "./services/auth.service";
import { login, logout, setAvatar, setUsername } from "./store/user/userSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

function App() {
  const dispatch = useAppDispatch();

  const checkAvatar = async (avatar: string): Promise<string> => {
    if (avatar.includes("https")) {
      return avatar;
    }
    const base64 = await AuthService.getAvatar(avatar);
    return "data:;base64," + base64;
  };

  const checkAuth = async () => {
    const token = getTokenFromLocalStorage();
    try {
      if (token.length > 0) {
        const data = await AuthService.updateStatus("online");
        if (data) {
          dispatch(login(data));
          dispatch(setUsername(data.username));
          Cookies.set("username", data.username);
          const ava = await checkAvatar(data.avatar);
          dispatch(setAvatar(ava));
        } else {
          dispatch(logout());
        }
      }
    } catch (err: any) {
      const error = err.response?.data.message;
      toast.error(error.toString());
    }
  };

  useEffect(() => {
    if (Cookies.get("jwt_token"))
      setTokenToLocalStorage("token", Cookies.get("jwt_token") || "");
    checkAuth();
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
