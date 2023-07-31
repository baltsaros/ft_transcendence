import { useState } from "react";
import ChatList from "./ChatList";

type Message = {
    senderId: string;
    content: string;
  };

function ChatBar() {
    // state
    const [newmessage, setMessage] =  useState("");
    const [messageList, setMessageList] =  useState<Message[]>([]);

    // behavior
    const handleClick = () => {
        const message = {
            senderId: "hdony",
            content: newmessage
        };
        setMessageList([...messageList, message]);
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
        setMessage(event.target.value);
    }

    // render
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