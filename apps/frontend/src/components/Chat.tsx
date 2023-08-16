import ChatBar from "./ChatBar";
import { io } from 'socket.io-client';
import { useEffect } from 'react';
import SocketService from "../services/socket.service";

function Chat() {
    /* STATE */

    /* BEHAVIOR */
    useEffect(() => {
      const socket = io('http://localhost:3000/api');
  
      console.log("useEffect");
      
      socket.on('connect', () => {
        console.log('Connected to WebSocket');
  
        // Emit a test event
        socket.emit('test', { message: 'Hello from client' });
      });
  
      socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket');
      });
  
      socket.on('test', (data) => {
        console.log('Received test data from server:', data);
      });
  
      return () => {
        socket.disconnect();
      };
    }, []);
  
      // console.log("connection established");
      // SocketService.emit('test', { message: 'WebSocket connection test'});
      
      // console.log("here");
      
      // SocketService.socket.on('test', (data) => {
      //   console.log('Received test data from backend:', data)}), []});

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
