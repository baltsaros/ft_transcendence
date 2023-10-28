import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { instance } from "../../../api/axios.api";
import { useChatWebSocket } from "../../../context/chat.websocket.context";
import { PlayerService } from "../../../services/player.service";
import { addBlocked, removeBlocked } from "../../../store/blocked/blockedSlice";
import { removeUser } from "../../../store/channel/channelSlice";
import { RootState, store } from "../../../store/store";
import { IChannelDmData } from "../../../types/types";
import { ChannelService } from "../../../services/channels.service";


function AdminMenu(props: any) {
    const {user, selectedChannel} = props;
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

    const isOwner = () => {
      return (selectedChannel?.owner.id === user.id);
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

    const handleKickChannel = async() => {
      try{
          const payload = {
              channelId: selectedChannel.id,
              username: user.username,
          }
          const response = await instance.post("channel/leaveChannel", payload);
          if (response)
              store.dispatch(removeUser(payload));
      } catch(error: any) {
          const err = error.response?.data.message;
          toast.error(err.toString());
      }
  }

  const handleBanUser = async () => {
    const payload = {
      idChannel: selectedChannel.id,
      idUser: user.id
    }
    ChannelService.addUserBannedToChannel(payload);
    handleKickChannel();
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
      const newDmChannel = await instance.post('channel/dmChannel', channelData);
      const payload = {
        user: strings,
        id: newDmChannel.data.id,
      }
      webSocketService.emit('onNewDmChannel', payload);
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

  const handleInviteFriends = async () => {
  
      try {
        const payload = {
          senderId: userLogged!.id,
          receiverId: user.id,
        }
          const ret = await PlayerService.sendInvitation(payload);
          if (ret)
            toast.success("Invitation sent !");
          else
            toast.error("Invitation not sent !");
        } catch (err: any) {}
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


  //render
  return (
    <div>
    <div className="text-black bg-blue-500 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none">
      <Menu direction={"left"} arrow={true} align={"center"} menuButton={<MenuButton className="w-24">{user.username}</MenuButton>}>
        <div className="bg-gray-500">
          {isFriend(user.username) && <MenuItem disabled>Invite as Friend</MenuItem>}
          {!isFriend(user.username) && <MenuItem onClick={handleInviteFriends}>Invite as Friend</MenuItem>}
          
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
          
          {/* Kick method */}
          {isOwner() && <MenuItem disabled >Kick user</MenuItem>}
          {!isOwner() && <MenuItem onClick={handleKickChannel}>Kick user</MenuItem>}

          {/* Ban method */}
          {isOwner() && <MenuItem disabled >Ban user</MenuItem>}
          {!isOwner() && <MenuItem onClick={handleBanUser}>Ban user</MenuItem>}
            <MenuItem>Mute user</MenuItem>
            <MenuItem>Set as admin</MenuItem>
        </div>
      </Menu>
    </div>
    </div>
  )
}
export default AdminMenu;