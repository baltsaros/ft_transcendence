import { MenuItem } from "@szhsin/react-menu";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { instance } from "../../../api/axios.api";
import { useChatWebSocket } from "../../../context/chat.websocket.context";
import { PlayerService } from "../../../services/player.service";
import { addBlocked, fetchBlocked, removeBlocked } from "../../../store/blocked/blockedSlice";
import { RootState, store } from "../../../store/store";
import { usePongWebSocket } from "../../../context/pong.websocket.context";
import WaitingGame from "../../pong/WaitingGame";
import WaitingInvite from "../../pong/WaitingInvitation";
import { IChannelDmData, IResponseUser, IUserUsername } from "../../../types/types";

function NormalPlayerMenu(user: IResponseUser) {
  //state
  const friends = useSelector((state: RootState) => state.friend.friends);
  const blocked = useSelector((state: RootState) => state.blocked.users);
  const userLogged = useSelector((state: RootState) => state.user.user);
  const ChatWebSocketService = useChatWebSocket();
  const PongWebSocketService = usePongWebSocket();
//   const webSocketService = useChatWebSocket();
  const invitations = useSelector((state: RootState) => state.invitation.invitations);

  const isFriend = (username: string) => {
    return friends.some((item) => item.username === username);
  };

  const isBlocked = (username: string) => {
    return blocked.some((item) => item.username === username);
  };

  const isInvited = (username: string) => {
    return invitations.some((item) => item.username === username);
  };

  const handleBlockUser = async () => {
    const payload = {
      senderId: userLogged!.id,
      receiverId: user.id,
    };
    await PlayerService.blockUser(payload);
  };
  const handleUnblockUser = async () => {
    const payload = {
      senderId: userLogged!.id,
      receiverId: user.id,
    };
    await PlayerService.unblockUser(payload);
  };

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
      } else {
        toast.error("Channel already exists");
      }
    } catch (error: any) {
      const err = error.response?.data.message;
      toast.error(err.toString());
    }
  };

  const handleGameInvitation = () => {
	PongWebSocketService!.emit("sendGameInvitation", {data: {sender: userLogged!.username, receiver: user.username}});
  }

  const handleAddInvitation = async () => {
      const payload = {
      senderId: userLogged!.id,
      receiverId: user.id,
    };
    const ret = await PlayerService.sendInvitation(payload);
    if (!ret){
      toast.error("something went wrong with invitation");
      return;
    }
    if (ret.data === 2)
      return (toast.error("Invitation already sent!"))
    toast.success("Invitation sent !");
  }

  //render
  return (
    <div className="bg-gray-500">
      {(isFriend(user.username) || isInvited(user.username)) && (
        <MenuItem disabled>Invite as Friend</MenuItem>
      )}
      {!isFriend(user.username) && !isInvited(user.username) && <MenuItem onClick={handleAddInvitation}>Invite as Friend</MenuItem>}

      <MenuItem>
        <Link to={"/player/" + user.username}>View profile</Link>
      </MenuItem>

      {isBlocked(user.username) && (
        <MenuItem onClick={handleUnblockUser}>Unblock User</MenuItem>
      )}
      {!isBlocked(user.username) && (
        <MenuItem onClick={handleBlockUser}>Block User</MenuItem>
      )}

      <MenuItem onClick={handleDirectMessage}>Direct Message</MenuItem>

      {(user.status === "offline" || user.status === "inGame") && (
        <MenuItem disabled>Invite to game</MenuItem>
      )}
      {user.status === "online" && <MenuItem onClick={handleGameInvitation}>Invite to game</MenuItem>}
    </div>
  );
}
export default NormalPlayerMenu;
