import { useState } from "react";
import { instance } from "../api/axios.api";
import ChatList from "./ChatList";
import { IChannel, IMessage } from "../types/types";
import { useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";

interface ChildProps {
    selectedChannel: IChannel | null;
}

type Message = {
    senderId: string;
    content: string;
  };

const ChatBar: React.FC<ChildProps> = ({selectedChannel}) => {

    const user = useAppSelector((state: RootState) => state.user.user);
    
    /* STATE */
    const [newmessage, setMessage] =  useState("");
    const [messageList, setMessageList] =  useState<Message[]>([]);

    /* BEHAVIOR */
    /* IMessage type on undefined because useState can be null (TBD)*/
    const handleClick = async () => {
        const message: IMessage = {
            channelId: selectedChannel?.id,
            username: user?.username,
            message: newmessage,
        };
        console.log(message);
        await instance.post('message', message);
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
        setMessage(event.target.value);
    }

    /* RENDER */
    return (
        <div>
            <ChatList messageProp={messageList} />
        <div className="flex text-black items-center bg-gray-200 p-2">
            <input
            value={newmessage}
            type="text" 
            placeholder="Type your message..."
            onChange={handleChange}
            className="flex-grow p-2 border rounded-l-lg"
            />
        <button className="bg-blue-500 text-white p-3 rounded-r-lg" onClick={handleClick}>Send</button>
        </div>
        </div>
    );
}

export default ChatBar;