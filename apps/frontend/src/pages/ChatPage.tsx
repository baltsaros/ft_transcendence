/* The variable Chat gets assigned the value of an arrow function
** The arrow function is a functional component (= javascript function) of React 
** Components are used to encapsulate part of the UI to be, here a javascript function */
import { useState } from "react";
import Chat from "../components/chat/Chat";
import PlayersOnChannel from "../components/chat/playerOnServer/PlayersOnChannel";
import Channels from "../components/chat/channel/Channel";
import { IChannel } from "../types/types";

const chatPage: React.FC = () => {
    
    /* STATE */
    const [selectedChannel, setSelectedChannel] = useState<IChannel | null>(null);

    /* BEHAVIOR */
    const handleSelectedChannel = (channel: IChannel) => {
        setSelectedChannel(channel);}

    /* RENDER */
    return (
    <div className="flex items-stretch justify-center">
        <Channels onSelectChannel={handleSelectedChannel} />
        <Chat selectedChannel={selectedChannel} />
        { <PlayersOnChannel selectedChannel={selectedChannel} /> }
    </div>
    );
}

export default chatPage;