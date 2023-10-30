import { MenuItem } from "@szhsin/react-menu";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { instance } from "../../../api/axios.api";
import { useChatWebSocket } from "../../../context/chat.websocket.context";
import { addBlocked, removeBlocked } from "../../../store/blocked/blockedSlice";
import { removeUser } from "../../../store/channel/channelSlice";
import { RootState, store } from "../../../store/store";
import { ChannelService } from "../../../services/channels.service";

function AdminPlayerMenu(props: any) {
  const { user, selectedChannel } = props;
  //state
  const admins = useSelector((state: RootState) => state.admin.users);
  const muted = useSelector((state: RootState) => state.muted.users);
  const webSocketService = useChatWebSocket();

  const isAdmin = () => {
    return admins.some((item) => item.id === user.id);
  };

  const isOwner = () => {
    return selectedChannel?.owner.id === user.id;
  };

  const isMuted = () => {
    return muted.some((item) => item.id === user.id);
  };

  const handleKickChannel = async() => {
    try{
        const payload = {
            channelId: selectedChannel.id,
            username: user.username,
        }
        const response = await instance.post("channel/leaveChannel", payload);
        if (response) {
          store.dispatch(removeUser(payload));
        }
    } catch(error: any) {
        const err = error.response?.data.message;
        toast.error(err.toString());
    }
}

  const handleBanUser = async () => {
    const payload = {
      idChannel: selectedChannel.id,
      idUser: user.id,
    };
    await ChannelService.addUserBannedToChannel(payload);
    handleKickChannel();
  };

  const handleMuteUser = async () => {
    const payload = {
      idChannel: selectedChannel.id,
      idUser: user.id,
    };
    await ChannelService.addMutedUserOfChannel(payload);
  };

  const handleUnmuteUser = async () => {
    const payload = {
      idChannel: selectedChannel.id,
      idUser: user.id,
    };
    await ChannelService.removeMutedUserOfChannel(payload);
  };

  // useEffect(() => {
  //   if (webSocketService) {
  //     webSocketService.on("userBlocked", (payload: any) => {
  //       store.dispatch(addBlocked(payload));
  //     });
  //     webSocketService.on("userUnblocked", (payload: any) => {
  //       store.dispatch(removeBlocked(payload));
  //     });

  //     return () => {
  //       webSocketService.off("userBlocked");
  //       webSocketService.off("userUnblocked");
  //     };
  //   }
  // }, []);

  //render
  return (
    <div className="bg-gray-500">
      {/* Kick method */}
      {!isOwner() && !isAdmin() && (
        <MenuItem onClick={handleKickChannel}>Kick user</MenuItem>
      )}
      {(isOwner() || isAdmin()) && <MenuItem disabled>Kick user</MenuItem>}

      {/* Ban method */}
      {!isOwner() && !isAdmin() && (
        <MenuItem onClick={handleBanUser}>Ban user</MenuItem>
      )}
      {(isOwner() || isAdmin()) && <MenuItem disabled>Ban user</MenuItem>}

      {!isMuted() && !isOwner() && !isAdmin() && (
        <MenuItem onClick={handleMuteUser}>Mute user</MenuItem>
      )}
      {(isOwner() || isAdmin()) && <MenuItem disabled>Mute user</MenuItem>}

      {isMuted() && !isOwner() && !isAdmin() && (
        <MenuItem onClick={handleUnmuteUser}>Unmute user</MenuItem>
      )}
      {(isOwner() || isAdmin()) && <MenuItem disabled>Unmute user</MenuItem>}
    </div>
  );
}
export default AdminPlayerMenu;
