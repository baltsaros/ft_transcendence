/* The variable Chat gets assigned the value of an arrow function
** The arrow function is a functional component (= javascript function) of React 
** Components are used to encapsulate part of the UI to be, here a javascript function */
import { useEffect, useState } from "react";
import Chat from "../components/chat/Chat";
import PlayersOnChannel from "../components/chat/playerOnServer/PlayersOnChannel";
import Channel from "../components/chat/channel/Channel";
import { IChannel } from "../types/types";
import { fetchChannel, removeUser } from "../store/channel/channelSlice";
import { RootState, store } from "../store/store";
import { useChatWebSocket } from "../context/chat.websocket.context";
import GameInvitation from "../components/pong/Invitation";
import { usePongWebSocket } from "../context/pong.websocket.context";
import WaitingInvite from "../components/pong/WaitingInvitation";
import { useChannel } from "../context/selectedChannel.context";
import { fetchBlocked } from "../store/blocked/blockedSlice";
import { fetchInvitations } from "../store/user/invitationSlice";
import { fetchAdmin } from "../store/channel/adminSlice";
import { fetchFriends } from "../store/user/friendsSlice";
import { fetchMuted } from "../store/channel/mutedSlice";
import { useSelector } from "react-redux";
import { fetchAllUsers } from "../store/user/allUsersSlice";

const chatPage: React.FC = () => {

    /* STATE */
    const [selectedChannel, setSelectedChannel] = useState<IChannel | null>(null);
    const chatWebSocketService = useChatWebSocket();
    const pongWebSocketService = usePongWebSocket();
	const [gameInvitationSent, setGameInvitationSent] = useState<boolean>(false);
	const [gameInvitationReceived, setGameInvitationReceived] = useState<boolean>(false);
	const [sender, setSender] = useState<string | null>(null);
	const [receiver, setReceiver] = useState<string | null>(null);
	const userConnected = useSelector((state: RootState) => state.user.user);

//   const webSocketService = useChatWebSocket();
  const selectedChannelContext = useChannel();
    /* STATE */
    // const [selectedChannel, setSelectedChannel] = useState<IChannel | null>(null);
    /* BEHAVIOR */
    // const handleSelectedChannel = (channel: IChannel | null) => {
    //     setSelectedChannel(channel);}

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
			selectedChannelContext.setSelectedChannel(null);
		  });
		  return () => {
			chatWebSocketService.off("userLeft");
		  };
		}
	  }, []);
	  useEffect(() => {
		if (chatWebSocketService) {
			chatWebSocketService.on("usernameUpdatedChannel", (payload: any) => {
			  store.dispatch(fetchBlocked(userConnected!.id));
			  store.dispatch(fetchInvitations(userConnected!.username));
			  store.dispatch(fetchChannel());
			  store.dispatch(fetchAdmin(userConnected!.id));
			  store.dispatch(fetchFriends(userConnected!.username));
			  store.dispatch(fetchMuted(userConnected!.id));
			  store.dispatch(fetchAllUsers());
		  });
		  return () => {
			chatWebSocketService.off("usernameUpdatedChannel");
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