import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { PlayerService } from '../../services/player.service';
import { IUserWithStatus } from '../../types/types';

function PlayersOnServer() {
    
    // state
    const [players, setPlayers] = useState<IUserWithStatus[] | undefined>([
        { username: 'hdony', id: 1, status: 'online' }
      ])
    
    // behavior
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

    // render
    
    return (
        <div className="flex flex-col items-stretch justify-center h-screen bg-gray-100 w-full">
        <div className="flex flex-grow w-full">
            <div className="flex-1 p-4 border bg-gray-100 m-2">
                <div className="flex-1 p-4 border bg-gray-100 m-2">
                    <h1 className="text-lg font-bold mb-2 text-gray-600">Players on server</h1>
                    <div className="flex flex-col text-black space-y-4">
                        {players.map(player => (
                            <div className="bg-blue-300 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded" key={player.id} >
                                <button>{ player.username }</button>
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