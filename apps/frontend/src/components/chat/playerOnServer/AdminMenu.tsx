
// import { fetchFriends, fetchInvitation } from "../store/user/userSlice";

import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { instance } from "../../../api/axios.api";
import { useChatWebSocket } from "../../../context/chat.websocket.context";
import { ChannelService } from "../../../services/channels.service";
import { RootState } from "../../../store/store";
import { IChannelDmData, IResponseUser, IUser, IUserUsername } from "../../../types/types";
import PlayerMenu from "./PlayerMenu";


function AdminMenu(user: IResponseUser) {

    //state
    const friends = useSelector((state: RootState) => state.friend.friends);
    const userLogged = useSelector((state: RootState) => state.user.user);
    const webSocketService = useChatWebSocket();

    const isFriend = (username: string) => {
      return (friends.some(item => item.username === username));
    }

    const handleDirectMessage = async () => {
      try{ 
        const strings = [user.username, userLogged?.username];
        strings.sort();
        const channelName = strings.join('_');
        const channelData: IChannelDmData = {
            name: channelName,
            mode: 'private',
            sender: userLogged?.id!,
            receiver: user.username,
            password: '',
        }
        // 1. The new instance in the channel table could be done directly in the backend when emitting the event
        const newDmChannel = await instance.post('channel/dmChannel', channelData);
        const payload = {
          user: strings,
          id: newDmChannel.data.id,
        }
        webSocketService.emit('onNewDmChannel', payload);
        if (newDmChannel) {
          toast.success("Channel successfully added!");
          // store.dispatch(addChannel(newDmChannel.data));
        }
    } catch (error: any) {
        const err = error.response?.data.message;
        toast.error(err.toString());
    } 
  }

  //render
  return (
    <div>
    <div className="text-black bg-blue-500 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none">
      <Menu direction={"left"} arrow={true} align={"center"} menuButton={<MenuButton className="w-24">{user.username}</MenuButton>}>
        <div className="bg-gray-500">
          {isFriend(user.username) && <MenuItem disabled>Invite as Friend</MenuItem>}
          {!isFriend(user.username) && <MenuItem>Invite as Friend</MenuItem>}
          
          <MenuItem>
            <Link to={"/player/" + user.username}>View profile</Link>
          </MenuItem>
          
          <MenuItem onClick={handleDirectMessage}>Direct Message</MenuItem>
          
          {(user.status === "offline" || user.status === "inGame") && 
            <MenuItem disabled>Invite to game</MenuItem>}
          {user.status === "online" && 
            <MenuItem>Invite to game</MenuItem>}
        </div>
      </Menu>
    </div>
    </div>
  )
}
export default AdminMenu;