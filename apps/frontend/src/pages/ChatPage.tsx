/* The variable Chat gets assigned the value of an arrow function
** The arrow function is a functional component (= javascript function) of React 
** Components are used to encapsulate part of the UI to be, here a javascript function */
import { useState, useEffect } from "react";
import Chat from "../components/chat/Chat";
import Channels from "../components/chat/Channel";
import { IChannel } from "../types/types";
import { useWebSocket } from "../context/WebSocketContext";

const chatPage: React.FC = () => {
    
    const webSocketService = useWebSocket();
    /* STATE */
    const [selectedChannel, setSelectedChannel] = useState<IChannel | null>(null);

    /* BEHAVIOR */
    const handleSelectedChannel = (channel: IChannel) => {
        setSelectedChannel(channel);}

    useEffect(() => {
        webSocketService.on('connect', () => {
            console.log('Connected to WebSocket server');
        })
        webSocketService.on('onMessage', () => {
            console.log('message received')
        })

        return () => {
            webSocketService.disconnect();
        }
    }, []);
        
    /* RENDER */
    return (
    <div className="flex items-stretch justify-center">
        <Channels onSelectChannel={handleSelectedChannel} />
        <Chat selectedChannel={selectedChannel} />
        {/* <PlayersOnServer /> */}
    </div>
    );
}

export default chatPage;