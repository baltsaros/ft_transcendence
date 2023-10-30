import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { logout } from "../store/user/userSlice";
import { useAppDispatch } from "../store/hooks";
import { removeTokenFromLocalStorage } from "../helpers/localstorage.helper";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { AuthService } from "../services/auth.service";
import { useChatWebSocket } from "../context/chat.websocket.context";
import { useEffect } from "react";
import { IResponseUser } from "../types/types";
import { RootState, store } from "../store/store";
import { updateStatus } from "../store/user/allUsersSlice";
import { updateStatusFriend } from "../store/user/friendsSlice";
import { useSelector } from "react-redux";
import { updateStatutChannel } from "../store/channel/channelSlice";

export default function Logout() {
  const navigate = useNavigate();
  const webSocketService = useChatWebSocket();
  const dispatch = useAppDispatch();
  const userUpdate = useSelector((state: RootState) => state.user.user);

  if (webSocketService)
    webSocketService.emit("updateStatus", { data: { userUpdate } });

  const logoutHandler = async () => {
    const userUpdate = await AuthService.updateStatus("offline");
    if (webSocketService) webSocketService.emit("updateStatus", { data: { userUpdate } });
    dispatch(logout());
    removeTokenFromLocalStorage("token");
    toast.success("Bye!");
    Cookies.remove("jwt_token");
    Cookies.remove("username");
    Cookies.remove("intraId");
    navigate("/");
  };

  useEffect(() => {
    if (webSocketService) {
      webSocketService.on("newUpdateStatus", (data: IResponseUser) => {
        store.dispatch(updateStatus(data));
        store.dispatch(
          updateStatusFriend({
            username: data.username,
            status: data.status,
        })
      );
      store.dispatch(updateStatutChannel(data));
    });
    return () => {
      webSocketService.off("newUpdateStatus");
    };
  }
  }, []);

  //render

  return (
    <button className="btn btn-red rounded-md" onClick={logoutHandler}>
      <span className="">Log out</span>
      <FaSignOutAlt />
    </button>
  );
}
