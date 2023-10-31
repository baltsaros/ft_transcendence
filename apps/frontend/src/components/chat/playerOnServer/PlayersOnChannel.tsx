import { useState, useEffect } from "react";
import { IChannel, IResponseUser } from "../../../types/types";
import { useSelector } from "react-redux";
import { RootState, store } from "../../../store/store";
import { useChatWebSocket } from "../../../context/chat.websocket.context";
import { addBanned, fetchChannel } from "../../../store/channel/channelSlice";
import PlayerMenu from "./PlayerMenu";
import {
  addAdmin,
  removeAdmin,
} from "../../../store/channel/adminSlice";
// import { addBanned } from "../../../store/channel/channelSlice";
import { addMuted, removeMuted } from "../../../store/channel/mutedSlice";
import { useChannel } from "../../../context/selectedChannel.context";

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
    <div className="flex flex-col items-stretch justify-center h-screen bg-gray-100 w-full">
      <div className="flex flex-grow w-full">
        <div className="flex-1 p-4 border bg-gray-100 m-2">
          <div className="flex-shrink-0 p-4 border bg-gray-100 m-2">
            <h1 className="text-lg font-bold mb-2 text-gray-600">
              Players on channel
            </h1>
          </div>
          <div className="flex-shrink-0 p-4 bg-gray-100 m-2">
            <p className="text-xl mb-1 text-gray-600">Online</p>
            <hr />
            <ul className="text-black">
              {usersOfChannel?.map(
                (user) =>
                  user.id !== userConnected!.id &&
                  isOnline(user) && (
                    <li key={user.id}>
                      {selectedChannelContext.selectedChannel && (
                        <PlayerMenu {...{ user }}></PlayerMenu>
                        // <PlayerMenu {...{ user, selectedChannel }}></PlayerMenu>
                      )}
                    </li>
                  )
              )}
            </ul>
          </div>
          <div className="flex-shrink-0 p-4 bg-gray-100 m-2">
            <p className="text-xl mb-1 text-gray-600">Offline</p>
            <hr />
            <ul className="text-black">
              {usersOfChannel?.map(
                (user) =>
                  user.id !== userConnected!.id &&
                  isOffline(user) && (
                    <li key={user.id}>
                      {selectedChannelContext.selectedChannel && (
                        <PlayerMenu {...{ user}}></PlayerMenu>
                      )}
                    </li>
                  )
              )}
            </ul>
          </div>
          <div className="flex-shrink-0 p-4 bg-gray-100 m-2">
            <p className="text-xl mb-1 text-gray-600">In game</p>
            <hr />
            <ul className="text-black">
              {usersOfChannel?.map(
                (user) =>
                  user.id !== userConnected!.id &&
                  isIngame(user) && (
                    <li key={user.id}>
                      {selectedChannel && (
                        <PlayerMenu {...{ user, selectedChannel }}></PlayerMenu>
                      )}
                    </li>
                  )
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayersOnChannel;
