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
import GameInvitation from "../components/pong/Invitation";
import { usePongWebSocket } from "../context/pong.websocket.context";

const chatPage: React.FC = () => {

    /* STATE */
    const [selectedChannel, setSelectedChannel] = useState<IChannel | null>(null);
    const chatWebSocketService = useChatWebSocket();
    const pongWebSocketService = usePongWebSocket();
	const [gameInvitation, setGameInvitation] = useState<boolean>(false);

    /* BEHAVIOR */
    const handleSelectedChannel = (channel: IChannel | null) => {
        setSelectedChannel(channel);}

		useEffect( () => {

			chatWebSocketService!.on('GameInvitationReceived', (data: { sender: string}) => {
				console.log("game invitation received. Sender : ", data.sender);
				setGameInvitation(true);
			});

			return () => {
				chatWebSocketService!.off('GameInvitationReceived');
			  };
		}, [chatWebSocketService]);


       useEffect(() => {
    if (chatWebSocketService) {
      chatWebSocketService.on("userLeft", (payload: any) => {
        store.dispatch(removeUser(payload));
      });
      return () => {
        chatWebSocketService.off("userLeft");
      };
    }
  }, []);

    /* RENDER */
    return (
			<div className="flex items-stretch justify-center">
				{gameInvitation && (<GameInvitation />)}
				<Channels onSelectChannel={handleSelectedChannel}/>
				<Chat selectedChannel={selectedChannel} />
				<PlayersOnChannel selectedChannel={selectedChannel} />
			</div>
		);
}

export default chatPage;