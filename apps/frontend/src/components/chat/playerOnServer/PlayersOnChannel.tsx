import { useState, useEffect } from "react";
import { IChannel, IResponseUser } from "../../../types/types";
import { useSelector } from "react-redux";
import { RootState, store } from "../../../store/store";
import { useChatWebSocket } from "../../../context/chat.websocket.context";
import { addBanned, fetchChannel } from "../../../store/channel/channelSlice";
import PlayerMenu from "./PlayerMenu";
import {
  addAdmin,
  fetchAdmin,
  removeAdmin,
} from "../../../store/channel/adminSlice";
// import { addBanned } from "../../../store/channel/channelSlice";
import { addMuted, fetchMuted, removeMuted } from "../../../store/channel/mutedSlice";
import { useChannel } from "../../../context/selectedChannel.context";
import { fetchBlocked } from "../../../store/blocked/blockedSlice";
import { fetchInvitations } from "../../../store/user/invitationSlice";
import { fetchFriends } from "../../../store/user/friendsSlice";
import { PlayerService } from "../../../services/player.service";

// interface ChildProps {
//   selectedChannel: IChannel | null;
// }

function PlayersOnChannel() {
// const PlayersOnChannel: React.FC<ChildProps> = ({ selectedChannel }) => {
  const webSocketService = useChatWebSocket();
  const selectedChannelContext = useChannel();

  // behavior
  const [usersOfChannel, setUsersOfChannel] = useState<IResponseUser[]>();
  const isOnline = (value: IResponseUser) => value.status === "online";
  const isOffline = (value: IResponseUser) => value.status === "offline";
  const isIngame = (value: IResponseUser) => value.status === 'inGame';
  const userConnected = useSelector((state: RootState) => state.user.user);

  const channels = useSelector((state: RootState) => state.channel.channel);

  useEffect(() => {
    if (selectedChannelContext.selectedChannel) {
      const channel = channels.filter(
        (elem) => elem.id === selectedChannelContext.selectedChannel?.id
      )[0];
      setUsersOfChannel(channel.users);
    }
  }, [selectedChannelContext.selectedChannel, channels]);

  useEffect(() => {
    if (webSocketService) {

      webSocketService.on("userJoined", (payload: any) => {
        store.dispatch(fetchChannel());
      });
      webSocketService.on("userBanned", (payload: any) => {
        store.dispatch(addBanned(payload));
      });
      webSocketService.on("adminAdded", (payload: any) => {
        store.dispatch(addAdmin(payload.user));
      });
      webSocketService.on("adminRemoved", (payload: any) => {
        store.dispatch(removeAdmin(payload.user));
      });
      webSocketService.on("userMuted", (payload: any) => {
        store.dispatch(addMuted(payload.user));
      });
      webSocketService.on("userUnmuted", (payload: any) => {
        store.dispatch(removeMuted(payload.user));
      });
      return () => {
        webSocketService.off("userLeft");
        webSocketService.off("userJoined");
        webSocketService.off("DmChannelJoined");
        webSocketService.off("userBanned");
        webSocketService.off("adminAdded");
        webSocketService.off("adminRemoved");
        webSocketService.off("userMuted");
        webSocketService.off("userUnmuted");
      };
    }
  }, []);

  // render
  return (
	<div className="max-w-xs flex-1 p-4 border rounded-lg bg-white m-6 shadow-md h-[80vh]">
	<div className="p-4 bg-gray-200 rounded-lg">
	  <h1 className="text-2xl font-semibold mb-2 text-gray-800">
		Players on channel
	  </h1>
	</div>
	<div className="bg-gray-100 m-2 rounded-lg space-y-4">
	  <div className="p-4">
		<p className="text-xl mb-2 text-gray-600">Online</p>
		<hr className="mb-2" />
		<ul className="text-gray-700">
		  {usersOfChannel?.map(
			(user) =>
			  user.id !== userConnected!.id &&
			  isOnline(user) && (
				<li key={user.id} className="mb-2">
				  {selectedChannelContext.selectedChannel && (
					<PlayerMenu {...{ user }}></PlayerMenu>
				  )}
				</li>
			  )
		  )}
		</ul>
	  </div>
	  <div className="p-4">
		<p className="text-xl mb-2 text-gray-600">Offline</p>
		<hr className="mb-2" />
		<ul className="text-gray-700">
		  {usersOfChannel?.map(
			(user) =>
			  user.id !== userConnected!.id &&
			  isOffline(user) && (
				<li key={user.id} className="mb-2">
				  {selectedChannelContext.selectedChannel && (
					<PlayerMenu {...{ user }}></PlayerMenu>
				  )}
				</li>
			  )
		  )}
		</ul>
	  </div>
	  <div className="p-4">
		<p className="text-xl mb-2 text-gray-600">In game</p>
		<hr className="mb-2" />
		<ul className="text-gray-700">
		  {usersOfChannel?.map(
			(user) =>
			  user.id !== userConnected!.id &&
			  isIngame(user) && (
				<li key={user.id} className="mb-2">
				  {selectedChannelContext.selectedChannel && (
					<PlayerMenu {...{ user }}></PlayerMenu>
				  )}
				</li>
			  )
		  )}
		</ul>
	  </div>
	</div>
  </div>
  );
};

export default PlayersOnChannel;
