import { MenuItem } from "@szhsin/react-menu";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { instance } from "../../../api/axios.api";
import { useChatWebSocket } from "../../../context/chat.websocket.context";
import { PlayerService } from "../../../services/player.service";
import { addBlocked, removeBlocked } from "../../../store/blocked/blockedSlice";
import { RootState, store } from "../../../store/store";
import { IChannelDmData, IResponseUser } from "../../../types/types";


function NormalPlayerMenu(user: IResponseUser) {

    //state
    const friends = useSelector((state: RootState) => state.friend.friends);
    const blocked = useSelector((state: RootState) => state.blocked.blocked);
    const userLogged = useSelector((state: RootState) => state.user.user);
    const webSocketService = useChatWebSocket();

    const isFriend = (username: string) => {
      return (friends.some(item => item.username === username));
    }

    const isBlocked = (username: string) => {
      return (blocked.some(item => item.username === username));
    }

    const handleBlockUser = async () => {
      const payload = {
        senderId: userLogged!.id,
        receiverId: user.id,
      }
      PlayerService.blockUser(payload);
    
    }
    const handleUnblockUser = async () => {
      const payload = {
        senderId: userLogged!.id,
        receiverId: user.id,
      }
      PlayerService.unblockUser(payload);
    }


    useEffect(() => {
      webSocketService.on("userBlocked", (payload: any) => {
          store.dispatch(addBlocked(payload));
      });
      webSocketService.on("userUnblocked", (payload: any) => {
        store.dispatch(removeBlocked(payload));
    });
      return () => {
          webSocketService.off('userBlocked');
          webSocketService.off('userUnblocked');
              };
  }, []);

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
        const newDmChannel = await instance.post('channel/dmChannel', channelData);
        if (newDmChannel.data) {
          toast.success("Channel successfully added!");
        }
        else {
          toast.error("Channel already exists");
        }
    } catch (error: any) {
        const err = error.response?.data.message;
        toast.error(err.toString());
    } 
  }

  //render
  return (
    <div className="bg-gray-500">
          {isFriend(user.username) && <MenuItem disabled>Invite as Friend</MenuItem>}
          {!isFriend(user.username) && <MenuItem>Invite as Friend</MenuItem>}

          <MenuItem>
            <Link to={"/player/" + user.username}>View profile</Link>
          </MenuItem>

          {isBlocked(user.username) && <MenuItem onClick={handleUnblockUser}>Unblock User</MenuItem>}
          {!isBlocked(user.username) && <MenuItem onClick={handleBlockUser}>Block User</MenuItem>}

          <MenuItem onClick={handleDirectMessage}>Direct Message</MenuItem>

          {(user.status === "offline" || user.status === "inGame") && 
            <MenuItem disabled>Invite to game</MenuItem>}
          {user.status === "online" && 
            <MenuItem>Invite to game</MenuItem>}
        </div>
  )
}
export default NormalPlayerMenu;