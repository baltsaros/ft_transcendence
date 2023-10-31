import { MenuItem } from "@szhsin/react-menu";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { instance } from "../../../api/axios.api";
import { removeUser } from "../../../store/channel/channelSlice";
import { RootState, store } from "../../../store/store";
import { ChannelService } from "../../../services/channels.service";
import { useChannel } from "../../../context/selectedChannel.context";


function OwnerMenu(props: any) {
    const {user} = props;
    const selectedChannelContext = useChannel();
    // const {user, selectedChannel} = props;
    //state
    const admins = useSelector((state: RootState) => state.admin.users);
    const muted = useSelector((state: RootState) => state.muted.users);

    const isAdmin = () => {
      return (admins.some(item => item.id === user.id));
    }

    const isMuted = () => {
      return (muted.some(item => item.id === user.id));
    }

    const handleKickChannel = async() => {
      try{
          const payload = {
              channelId: selectedChannelContext.selectedChannel!.id,
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
      idChannel: selectedChannelContext.selectedChannel!.id,
      idUser: user.id
    }
    await ChannelService.addUserBannedToChannel(payload);
    handleKickChannel();
  }


  const handleAddUserAsAdmin = async () => {
    const payload = {
      idChannel: selectedChannelContext.selectedChannel!.id,
      idUser: user.id
    }
    await ChannelService.addUserAsAdmin(payload);
  }

  const handleRemoveUserAsAdmin = async () => {
    const payload = {
      idChannel: selectedChannelContext.selectedChannel!.id,
      idUser: user.id
    }
    await ChannelService.removeUserAsAdmin(payload);
  }

  const handleMuteUser = async () => {
    const payload = {
      idChannel: selectedChannelContext.selectedChannel!.id,
      idUser: user.id
    }
    await ChannelService.addMutedUserOfChannel(payload);
  }

  const handleUnmuteUser = async () => {
    const payload = {
      idChannel: selectedChannelContext.selectedChannel!.id,
      idUser: user.id
    }
    await ChannelService.removeMutedUserOfChannel(payload);
  }

  //render
  return (
    <div className="bg-gray-500">

      {/* Kick method */}
      {<MenuItem onClick={handleKickChannel}>Kick user</MenuItem>}

      {/* Ban method */}
      {<MenuItem onClick={handleBanUser}>Ban user</MenuItem>}

      {!isMuted() && <MenuItem onClick={handleMuteUser}>Mute user</MenuItem>}
      {isMuted() && <MenuItem onClick={handleUnmuteUser}>Unmute user</MenuItem>}
      
      {!isAdmin() && <MenuItem onClick={handleAddUserAsAdmin}>Set as admin</MenuItem>}
      {isAdmin() && <MenuItem onClick={handleRemoveUserAsAdmin}>Remove as admin</MenuItem>}
    
    </div>
  )
}
export default OwnerMenu;