/* The variable Chat gets assigned the value of an arrow function
** The arrow function is a functional component (= javascript function) of React 
** Components are used to encapsulate part of the UI to be, here a javascript function */
import { useState } from "react";
import Chat from "../components/chat/Chat";
import Channels from "../components/chat/Channel";
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
        {/* <PlayersOnServer /> */}
    </div>
    );
}

export default chatPage;