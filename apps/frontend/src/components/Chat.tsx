import ChatBar from "./ChatBar";
import io from 'socket.io-client';
import { useEffect } from 'react';

function Chat() {
    /* STATE */

    /* BEHAVIOR */
    useEffect(() => {
        // alert('alert');
        const socket = io('http://localhost:5173'); // Replace with your server URL
    
        socket.on('connect', () => {
          console.log('Connected to WebSocket');
        });

        socket.on('testEvent', (data) => {
            console.log('Received test event:', data);
          });

        socket.on('disconnect', () => {
          console.log('Disconnected from WebSocket');
        });
    
        return () => {
          socket.disconnect();
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
                <div className="mt-auto">
                    <ChatBar />
                </div>
            </div>
        </div>
    </div>
    );
};

export default Chat;
