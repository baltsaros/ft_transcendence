import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState, store } from "../../../store/store";
import NormalPlayerMenu from "./NormalPlayerMenu";
import OwnerMenu from "./OwnerMenu";
import AdminPlayerMenu from "./AdminPlayerMenu";
import { fetchAdmin } from "../../../store/channel/adminSlice";
import { fetchMuted } from "../../../store/channel/mutedSlice";
import { useChannel } from "../../../context/selectedChannel.context";
import { useChatWebSocket } from "../../../context/chat.websocket.context";
import { addBlocked, removeBlocked } from "../../../store/blocked/blockedSlice";


function PlayerMenu(props: any) {
  const {user} = props;

    //state
    const userLogged = useSelector((state: RootState) => state.user.user);
    const selectedChannelContext = useChannel();
    const admins = useSelector((state: RootState) => state.admin.users);
    const webSocketService = useChatWebSocket();

    const isOwner = (id: number) => {
      return (selectedChannelContext.selectedChannel?.owner.id === id);
    }

    const isAdmin = (id: number) => {
      return (admins.some(item => item.id === id));
    }

    useEffect(() => {
      webSocketService!.on("userBlocked", (payload: any) => {
          store.dispatch(addBlocked(payload));
      });
      webSocketService!.on("userUnblocked", (payload: any) => {
        store.dispatch(removeBlocked(payload));
      });
      return () => {
          webSocketService!.off('userBlocked');
          webSocketService!.off('userUnblocked');
              };
  }, []);

  useEffect(() => {
    store.dispatch(fetchAdmin(selectedChannelContext.selectedChannel!.id));
    store.dispatch(fetchMuted(selectedChannelContext.selectedChannel!.id));
  }, []);
  

  //render
  return (
    <div>
    <div className="text-black bg-blue-500 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none">
      <Menu direction={"left"} arrow={true} align={"center"} menuButton={<MenuButton className="w-24">{user.username}</MenuButton>}>
        <NormalPlayerMenu {...user}/>

        {isOwner(userLogged!.id) && <OwnerMenu {...{user}}/>}
        {/* {isOwner(userLogged!.id) && <OwnerMenu {...{user, selectedChannel}}/>} */}

        {!isOwner(userLogged!.id) && isAdmin(userLogged!.id) && <AdminPlayerMenu {...{user}}/>}
        {/* {!isOwner(userLogged!.id) && isAdmin(userLogged!.id) && <AdminPlayerMenu {...{user, selectedChannel}}/>} */}


      </Menu>
    </div>
    </div>
  )
}
export default PlayerMenu;