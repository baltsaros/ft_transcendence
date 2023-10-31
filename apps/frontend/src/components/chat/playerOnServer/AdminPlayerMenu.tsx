import { MenuItem } from "@szhsin/react-menu";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { instance } from "../../../api/axios.api";
import { useChatWebSocket } from "../../../context/chat.websocket.context";
import { removeUser } from "../../../store/channel/channelSlice";
import { RootState, store } from "../../../store/store";
import { ChannelService } from "../../../services/channels.service";
import { useChannel } from "../../../context/selectedChannel.context";


function AdminPlayerMenu(props: any) {
  const { user } = props;
  // const { user, selectedChannel } = props;
  //state
  const admins = useSelector((state: RootState) => state.admin.users);
  const muted = useSelector((state: RootState) => state.muted.users);
  const selectedChannelContext = useChannel();

  const isAdmin = () => {
    return admins.some((item) => item.id === user.id);
  };

  const isOwner = () => {
    return selectedChannelContext.selectedChannel?.owner.id === user.id;
  };

  const isMuted = () => {
    return muted.some((item) => item.id === user.id);
  };

  const handleKickChannel = async() => {
    try{
      console.log('handleKickChannelAdmin');
        const payload = {
            channelId: selectedChannelContext.selectedChannel!.id,
            username: user.username,
        }
        const response = await instance.post("channel/leaveChannel", payload);
        if (response) {
          store.dispatch(removeUser(payload));
          selectedChannelContext.setSelectedChannel(null);
          console.log('selectedChannel:', selectedChannelContext.selectedChannel);
        }
    } catch(error: any) {
        const err = error.response?.data.message;
        toast.error(err.toString());
    }
}

  const handleBanUser = async () => {
    const payload = {
      idChannel: selectedChannelContext.selectedChannel!.id,
      idUser: user.id,
    };
    await ChannelService.addUserBannedToChannel(payload);
    handleKickChannel();
  };

  const handleMuteUser = async () => {
    const payload = {
      idChannel: selectedChannelContext.selectedChannel!.id,
      idUser: user.id,
    };
    await ChannelService.addMutedUserOfChannel(payload);
  };

  const handleUnmuteUser = async () => {
    const payload = {
      idChannel: selectedChannelContext.selectedChannel!.id,
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
