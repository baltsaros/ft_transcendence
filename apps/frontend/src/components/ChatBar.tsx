import { useState } from "react";
import ChatList from "./ChatList";
import { IMessage } from "../types/types";

type Message = {
    senderId: string;
    content: string;
  };

function ChatBar() {
    /* STATE */
    const [newmessage, setMessage] =  useState("");
    const [messageList, setMessageList] =  useState<Message[]>([]);

    /* BEHAVIOR */
    const handleClick = () => {
        // const message: IMessage = {
        //     channelId:
        //     username:
        //     message: 
        // };
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