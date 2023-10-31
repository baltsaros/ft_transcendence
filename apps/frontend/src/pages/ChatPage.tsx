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
import WaitingInvite from "../components/pong/WaitingInvitation";

const chatPage: React.FC = () => {

    /* STATE */
    const [selectedChannel, setSelectedChannel] = useState<IChannel | null>(null);
    const chatWebSocketService = useChatWebSocket();
    const pongWebSocketService = usePongWebSocket();
	const [gameInvitationSent, setGameInvitationSent] = useState<boolean>(false);
	const [gameInvitationReceived, setGameInvitationReceived] = useState<boolean>(false);
	const [sender, setSender] = useState<string | null>(null);
	const [receiver, setReceiver] = useState<string | null>(null);

    /* BEHAVIOR */
    const handleSelectedChannel = (channel: IChannel | null) => {
        setSelectedChannel(channel);}

	useEffect( () => {

		pongWebSocketService!.on('GameInvitationReceived', (data: { sender: string }) => {
			console.log("game invitation received. Sender : ", data.sender);
			setSender(data.sender);
			setGameInvitationReceived(true);
		});

		pongWebSocketService!.on('GameInvitationSent', (data: { receiver: string }) => {
			// console.log("game invitation sent. Sender : ", data.receiver);
			setReceiver(data.receiver);
			setGameInvitationSent(true);
		});
		return () => {
			pongWebSocketService!.off('GameInvitationReceived');
			pongWebSocketService!.off('GameInvitationSent');
		};
	}, [pongWebSocketService]);



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

	const handleCloseInvitationReceived = async () => {
		setGameInvitationReceived(false);
	};

	const handleCloseInvitationSent = async () => {
		setGameInvitationSent(false);
	};

    /* RENDER */
    return (
			<div className="flex items-stretch justify-center">
				{gameInvitationSent && receiver && (<WaitingInvite onClose={handleCloseInvitationSent} receiver={receiver} />)}
				{gameInvitationReceived && sender && (<GameInvitation onClose={handleCloseInvitationReceived} sender={sender}/>)}
				<Channels onSelectChannel={handleSelectedChannel}/>
				<Chat selectedChannel={selectedChannel} />
				<PlayersOnChannel selectedChannel={selectedChannel} />
			</div>
		);
}

export default chatPage;