import { useEffect } from "react";
import { IChannel, IMessage } from "../../types/types";
import ChatBar from "./ChatBar";
import socket from "../../services/socket.service"

interface ChildProps {
    selectedChannel: IChannel | null;
}

const Chat: React.FC<ChildProps> = ({selectedChannel}) => {
    /* STATE */

    /* BEHAVIOR */
    /* The useEffect() hook is used to perform side effects in component
    ** Fetching data, listen to events are side effects
    */
   useEffect(() => {
    console.log('useEffect()');
    socket.on('message', (message: IMessage) => {
        console.log(message);
    });
}); 
  
    /* RENDER */
    /* <div> is a container to encapsulate jsx code */
    return (   
    <div className="flex flex-col items-stretch justify-center h-screen bg-gray-100 w-full">
        <div className="flex flex-grow w-full">
            <div className="flex flex-col flex-1 p-4 border bg-gray-100 m-2">
                <div className="flex-shrink-0 p-4 border bg-gray-100 m-2">
                    <h1 className="text-lg font-bold mb-2 text-gray-600">Chat</h1>
                </div>
                <div className="text-lg font-bold mb-2 text-gray-600">
                    {
                    selectedChannel &&
                    <p>Selected Channel: {selectedChannel.name}</p>
                    }
                    {
                    !selectedChannel &&
                    <h2>Select a channel</h2>
                    }
                </div>
                <div className="mt-auto">
                    {
                        selectedChannel &&
                        <ChatBar selectedChannel={selectedChannel}  />
                    }
                </div>
            </div>
        </div>
    </div>
    );
};

export default Chat;
