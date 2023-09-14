import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { PlayerService } from '../../services/player.service';

function PlayersOnServer() {
    
    // state
    const [usagers, setUsagers] = useState([
        { name: 'hdony', id: 1 },
        { name: 'jvander', id: 2 },
        { name: 'abuzdin', id: 3 }
      ])
    
    // behavior
    
    useEffect(() =>  {
        // console.log("hahaha");
        const getAllUsers = async () => {
          try {
            const data =  await PlayerService.getAllUsers();
            // setFriends(data);
            console.log(data);
          } catch (err: any) {}}
          getAllUsers();
        }, [])

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
                    <div className="flex flex-col text-black space-y-4">
                        {usagers.map(usager => (
                            <div className="bg-blue-300 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded" key={usager.id} >
                                <button>{ usager.name }</button>
                                <p>Id { usager.id }</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
    );

}

export default PlayersOnServer;