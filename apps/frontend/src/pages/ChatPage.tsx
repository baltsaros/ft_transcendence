/* The variable Chat gets assigned the value of an arrow function
** The arrow function is a functional component (= javascript function) of React 
** Components are used to encapsulate part of the UI to be, here a javascript function */
import { useEffect, useState } from "react";
import Chat from "../components/chat/Chat";
import PlayersOnChannel from "../components/chat/playerOnServer/PlayersOnChannel";
import Channels from "../components/chat/channel/Channel";
import { IChannel } from "../types/types";
import { removeUser } from "../store/channel/channelSlice";
import { store } from "../store/store";
import { useChatWebSocket } from "../context/chat.websocket.context";

const chatPage: React.FC = () => {
    
    /* STATE */
    const [selectedChannel, setSelectedChannel] = useState<IChannel | null>(null);
    const webSocketService = useChatWebSocket();
    /* BEHAVIOR */
    const handleSelectedChannel = (channel: IChannel | null) => {
        setSelectedChannel(channel);}

       useEffect(() => {
    if (webSocketService) {
      webSocketService.on("userLeft", (payload: any) => {
        console.log("prout");
        store.dispatch(removeUser(payload));
      });
      return () => {
        webSocketService.off("userLeft");
      };
    }
  }, []);

    /* RENDER */
    return (
    <div className="flex items-stretch justify-center">
        <Channels onSelectChannel={handleSelectedChannel}/>
        <Chat selectedChannel={selectedChannel} />
        <PlayersOnChannel selectedChannel={selectedChannel} />
    </div>
    );
}

export default chatPage;