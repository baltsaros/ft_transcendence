<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { PlayerService } from '../../services/player.service';
import { IUserWithStatus } from '../../types/types';
import DropdownButtonOnLine from './PlayersOnServerOnline';
import DropdownButtonOffLine from './PlayersOnServerOffline';
=======
>>>>>>> main

function PlayersOnServer() {
    
    // state
    const [players, setPlayers] = useState<IUserWithStatus[] | undefined>([
        { username: 'hdony', id: 1, status: 'online' }
      ])
    
    // behavior
<<<<<<< HEAD
    useEffect(() =>  {
        const getAllUsers = async () => {
          try {
            const data =  await PlayerService.getAllUsers();
            setPlayers(data);
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
=======
>>>>>>> main

    // render
    
    return (
        <div className="flex flex-col items-stretch justify-center h-screen bg-gray-100 w-full">
            <div className="flex flex-grow w-full">
                <div className="flex-1 p-4 border bg-gray-100 m-2">
                    <div className="flex-shrink-0 p-4 border bg-gray-100 m-2">
                        <h1 className="text-lg font-bold mb-2 text-gray-600">Players on server</h1>
                    </div>
                    <div className="flex-shrink-0 p-4 bg-gray-100 m-2">
                        <p className="text-base mb-1 text-gray-600">Online</p>
                    </div>
                    <div className="flex flex-col text-black space-y-4">
                        {players.map(player => (
                            player.status === 'online' && <div key={player.id} >
                                <DropdownButtonOnLine username={ player.username } />
                            </div>
                        ))}
                    </div>
                    <div className="flex-shrink-0 p-4 bg-gray-100 m-2">
                        <p className="text-base mb-1 text-gray-600">Offline</p>
                    </div>
                    <div className="flex flex-col text-black space-y-4">
                        {players.map(player => (
                            player.status === 'offline' && <div key={player.id} >
                                <DropdownButtonOffLine username={ player.username } />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

}

export default PlayersOnServer;