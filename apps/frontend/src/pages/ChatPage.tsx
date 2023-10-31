/* The variable Chat gets assigned the value of an arrow function
** The arrow function is a functional component (= javascript function) of React 
** Components are used to encapsulate part of the UI to be, here a javascript function */
import { useEffect, useState } from "react";
import Chat from "../components/chat/Chat";
import PlayersOnChannel from "../components/chat/playerOnServer/PlayersOnChannel";
import Channel from "../components/chat/channel/Channel";
import { IChannel } from "../types/types";
import { removeUser } from "../store/channel/channelSlice";
import { store } from "../store/store";
import { useChatWebSocket } from "../context/chat.websocket.context";
import { useChannel } from "../context/selectedChannel.context";

const chatPage: React.FC = () => {
    
  const webSocketService = useChatWebSocket();
  const selectedChannelContext = useChannel();
    /* STATE */
    // const [selectedChannel, setSelectedChannel] = useState<IChannel | null>(null);
    /* BEHAVIOR */
    // const handleSelectedChannel = (channel: IChannel | null) => {
    //     setSelectedChannel(channel);}

       useEffect(() => {
    if (webSocketService) {
      webSocketService.on("userLeft", (payload: any) => {
        store.dispatch(removeUser(payload));
        selectedChannelContext.setSelectedChannel(null);
      });
      return () => {
        webSocketService.off("userLeft");
      };
    }
  }, []);

    /* RENDER */
    return (
    <div className="flex items-stretch justify-center">
        <Channel/>
        {/* <Channels onSelectChannel={handleSelectedChannel}/> */}
        <Chat/>
        {/* <Chat selectedChannel={selectedChannel} /> */}
        <PlayersOnChannel/>
        {/* <PlayersOnChannel selectedChannel={selectedChannel} /> */}
    </div>
    );
}

export default chatPage;