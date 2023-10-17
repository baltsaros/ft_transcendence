import { Scrollbar } from 'react-scrollbars-custom';
import { useEffect, useState } from "react";
import { instance } from "../../api/axios.api";
import { IChannel, IResponseMessage } from "../../types/types";
import { useChatWebSocket } from "../../context/ChatWebSocketContext";
import ChatBar from "./ChatBar";
import { store } from '../../store/store';
import { addChannel } from '../../store/channel/channelSlice';

interface ChildProps {
    selectedChannel: IChannel | null;
}

const Chat: React.FC<ChildProps> = ({selectedChannel}) => {
    const webSocketService = useChatWebSocket();

    /* STATE */
    const [message, setMessage] = useState<IResponseMessage[]>([]);

    /* BEHAVIOR */
   useEffect(() => {
    if (selectedChannel)
    {
        const fetchData = async () => {
            const message = await instance.get('channel/' + selectedChannel?.id);
            // console.log('backend response: ', message.data);
            setMessage(message.data.messages);
            // console.log('message state: ', message.data.messages);
        };
        fetchData();
    }
   }, [selectedChannel]);

   useEffect(() => {
    webSocketService.on('onMessage', (payload: IResponseMessage) => {
        // console.log('frontend message array: ', message);
        // console.log('frontend payload :', payload);
        setMessage((prevMessages) => [...prevMessages, payload]);
        // setMessage((prev) => [...prev, payload]);
    });
    
    return () => {
        webSocketService.off('onMessage');
      };
   }, []);

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
                    {<Scrollbar style={{ width: 300, height: 700 }}>
                    {
                        selectedChannel &&
                        message.map((idx, index) => (
                            <div
                            key={index}
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
                    </Scrollbar>}
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
