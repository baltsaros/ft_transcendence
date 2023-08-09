// import ftLogo from './assets/42_Logo.svg'
import "./App.css";
import { RouterProvider, useNavigate } from "react-router-dom";
import { router } from "./router/router";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { getTokenFromLocalStorage, setTokenToLocalStorage } from "./helpers/localstorage.helper";
import { AuthService } from "./services/auth.service";
import { login, logout } from "./store/user/userSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { RootState } from "./store/store";
import Cookies from "js-cookie";

function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user.user);
  
  const checkAuth = async () => {
    const token = getTokenFromLocalStorage();
    try {
      if (token.length > 0) {
        const data = await AuthService.getProfile();
        if (data) {
          dispatch(login(data));
        } else {
          dispatch(logout());
        }
      }
    } catch (err: any) {
      const error = err.response?.data.message;
      toast.error(error.toString());
    }
  };

  const checkUsername = async () => {
    const data = await AuthService.getProfile();
    if (user && data && data.username != user.username) {
      dispatch(login(data));
    }
  }

  useEffect(() => {
    if (Cookies.get("jwt_token"))
      setTokenToLocalStorage("token", Cookies.get("jwt_token"));
    checkAuth();
    checkUsername();
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
