import { useState, useEffect } from "react";
import { instance } from "../../api/axios.api";
import { IChannel, IMessage } from "../../types/types";
import { useAppSelector } from "../../store/hooks";
import { RootState } from "../../store/store";
// import { useWebSocket } from "../../context/WebSocketContext";

interface ChildProps {
    selectedChannel: IChannel | null;
}

type Message = {
    senderId: string;
    content: string;
  };

const ChatBar: React.FC<ChildProps> = ({selectedChannel}) => {

    const user = useAppSelector((state: RootState) => state.user.user);
    // const webSocketService = useWebSocket();
    
    /* STATE */
    const [value, setValue] =  useState("");

    /* BEHAVIOR */
    /* IMessage type on undefined because useState can be null (TBD)*/
    const handleClick = async () => {
        const message: IMessage = {
            channelId: selectedChannel?.id,
            username: user?.username,
            content: value,
        };
        console.log('frontend ChatBar:', message);
        await instance.post('message', message);
        // await webSocketService.emit('message', message);
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
        setValue(event.target.value);
    }

    /* RENDER */
    return (
        <div className="flex text-black items-center bg-gray-200 p-2">
            <input
            value={value}
            type="text" 
            placeholder="Type your message..."
            onChange={handleChange}
            className="flex-grow p-2 border rounded-l-lg"
            />
        <button className="bg-blue-500 text-white p-3 rounded-r-lg" onClick={handleClick}>Send</button>
        </div>
    );
}

export default ChatBar;