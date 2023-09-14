import { useEffect, useState } from "react";
import { instance } from "../../api/axios.api";
import { IChannel, IMessage, IResponseMessage } from "../../types/types";
import ChatBar from "./ChatBar";
import socket from "../../services/socket.service"

/* WebSocket Chat Implementation for documentation */

interface ChildProps {
    selectedChannel: IChannel | null;
}

const Chat: React.FC<ChildProps> = ({selectedChannel}) => {
    /* STATE */
    const [messages, setMessage] = useState<IResponseMessage[]>([]);

    /* BEHAVIOR */
    /* The useEffect() hook is used to perform side effects in component
    ** Fetching data, listen to events are side effects
    */
   useEffect(() => {
    console.log('selected channel', selectedChannel?.id);
    if (selectedChannel)
    {
        // 1. get request to channel messages
        const fetchData = async () => {
            const response = await instance.get('channel/' + selectedChannel?.id);
            // console.log('response.data:', response.data);
            setMessage(response.data.channelMessages);
        };
        fetchData();
    }
   }, [selectedChannel]);

//    useEffect(() => {
//     socket.on('message', (message: IMessage) => {
//         console.log('event receveived:', message);
//         // setMessage((prevMessages) => [...prevMessages, message]);

//     });
    
//     return () => {
//         socket.off('message');
//     }
// }, []);
  
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
                    messages.map(idx => (
                    <div
                    key={idx.id}
                    className={`${
                        idx.user.username === 'User1' ? 'self-start' : 'self-end'
                      } p-2 rounded-lg mb-2`}
                    >
                        <div className="text-sm font-semibold">
                        {idx.user.username}
                        </div>
                        <div className="bg-white p-2 rounded-lg shadow-md">
                        {idx.content}
                        </div>
                        </div>
                        ))}
                    {/* <button
                        key={idx.id}
                        className="bg-blue-300 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">{idx.user.username}
                    </button> */}
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
