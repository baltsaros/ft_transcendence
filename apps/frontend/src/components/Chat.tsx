import { IChannel } from "../types/types";
import ChatBar from "./ChatBar";

interface ChildProps {
    selectedChannel: IChannel | null;
}

const Chat: React.FC<ChildProps> = ({selectedChannel}) => {
    /* STATE */

    /* BEHAVIOR */
    // useEffect(() => {
    //     socket.emit('test', { message: 'Hello from client' });
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
                <div>
                    {
                    selectedChannel &&
                    <p>Selected Channel: {selectedChannel.name}</p>
                    }
                    {
                    !selectedChannel &&
                    <h2 className="text-lg font-bold mb-2 text-gray-600">Select a channel</h2>
                    }
                </div>
                <div className="mt-auto">
                    <ChatBar />
                </div>
            </div>
        </div>
    </div>
    );
};

export default Chat;
