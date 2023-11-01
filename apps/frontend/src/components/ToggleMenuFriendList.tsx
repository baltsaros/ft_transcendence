import { MenuItem, SubMenu } from "@szhsin/react-menu";
import {  IChannelDmData, IUserUsername } from "../types/types";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import { PlayerService } from "../services/player.service";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { RootState, store } from "../store/store";
import { useSelector } from "react-redux";
import { removeFriend } from "../store/user/friendsSlice";
import { instance } from "../api/axios.api";
import { useChatWebSocket } from "../context/chat.websocket.context";
import { usePongWebSocket } from "../context/pong.websocket.context";


function ToggleMenuFriendList(user: IUserUsername) {

    //state
    const users = useSelector((state: RootState) => state.allUser.users);
    const userLogged = useSelector((state: RootState) => state.user.user);
    const navigate = useNavigate();
	const ChatWebSocketService = useChatWebSocket();
	const PongWebSocketService = usePongWebSocket();
    //behaviour
    
    const deleteFriend = async () => {
        try {
            const receiverId = await PlayerService.getInfoUser(Cookies.get('username')!);
            if (!receiverId)
                return toast.error("User doesn't exists !");
            const senderId = await PlayerService.getInfoUser(user.username);
            if (!senderId)
                return toast.error("Friend to remove doesn't exist !");
            const data =  await PlayerService.removeFriend({receiverId, senderId});
            if (data)
            {
                const sender = users.filter((elem) => elem.id === senderId)[0];
                const senderUserUsername: IUserUsername = {
                    username: sender.username,
                    status: sender.status,
                };
                store.dispatch(removeFriend(senderUserUsername));
                toast.success("friend successfully deleted");
            }
        } catch (err: any) {
          const error = err.response?.data.message;
        }
      }
      
      const handleDirectMessage = async () => {
        try {
          const strings = [user.username, userLogged?.username];
          strings.sort();
          const channelName = strings.join("_");
          const channelData: IChannelDmData = {
            name: channelName,
            mode: "private",
            sender: userLogged?.id!,
            receiver: user.username,
            password: "",
          };
          const newDmChannel = await instance.post(
            "channel/dmChannel",
            channelData
          );
          if (newDmChannel.data) {
            toast.success("Channel successfully added!");
        }
        navigate("chat/");
        } catch (error: any) {
          const err = error.response?.data.message;
          toast.error(err.toString());
        }
      };

	  const handleGameInvitation = () => {
		PongWebSocketService!.emit("sendGameInvitation", {data: {sender: userLogged!.username, receiver: user.username}});
	  }

    //render
    return (
        <div className="bg-gray-500">
            <SubMenu direction={"left"} label={user.username}>
            <div className="bg-gray-500">
                <MenuItem>
                    <NavLink to={"player/" + user.username}>View Profile</NavLink>
                </MenuItem>
            </div>
            <div className="bg-gray-500">
                <MenuItem onClick={handleDirectMessage}>Direct message</MenuItem>
            </div>
			<div className="bg-gray-500">
				{(user.status === "offline" || user.status === "inGame") && (
				<MenuItem disabled>Invite to game</MenuItem>)}
				{user.status === "online" && <MenuItem onClick={handleGameInvitation}>Invite to game</MenuItem>}
            </div>
            <div className="bg-gray-500">
                <MenuItem onClick={() => deleteFriend()}>Remove friend</MenuItem>
            </div>
            </SubMenu>
        </div>
    );

}
export default ToggleMenuFriendList;