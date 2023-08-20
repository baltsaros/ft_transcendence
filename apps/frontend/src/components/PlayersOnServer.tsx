import { useEffect } from 'react';
import { io } from 'socket.io-client';

function PlayersOnServer() {
    
    // state

    // behavior
    // useEffect(() => {
    //     const socket = io('http://localhost:3000/api');
    
    //     socket.on('connect', () => {
    //       console.log('Connected to WebSocket');
    //     });
    
    //     socket.on('disconnect', () => {
    //       console.log('Disconnected from WebSocket');
    //     });
    
    //     return () => {
    //       socket.disconnect();
    //     };
    //   }, []);

    // render
    return (
        <div className="flex flex-col items-stretch justify-center h-screen bg-gray-100 w-full">
        <div className="flex flex-grow w-full">
            <div className="flex-1 p-4 border bg-gray-100 m-2">
                <div className="flex-1 p-4 border bg-gray-100 m-2">
                    <h1 className="text-lg font-bold mb-2 text-gray-600">Players on server</h1>
                </div>
            </div>
        </div>
    </div>
    );

}

export default PlayersOnServer;