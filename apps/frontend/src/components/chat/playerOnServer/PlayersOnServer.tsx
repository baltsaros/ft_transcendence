import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { PlayerService } from '../../../services/player.service';
import { IChannel, IUserUsername, IPlayersOnServerModalProps } from '../../../types/types';
import DropdownButton from './PlayersOnServerDropdownmenu';
import Cookies from 'js-cookie';

interface ChildProps {
    selectedChannel: IChannel | null;
}

const PlayersOnServer: React.FC<ChildProps> = ({selectedChannel}) => {
    
    // state
    const [onlinePlayers, setOnlinePlayers] = useState<IUserUsername[] | undefined>([
        { username: 'hdony', status: 'online' }
      ])
    const [offlinePlayers, setOfflinePlayers] = useState<IUserUsername[] | undefined>([
        { username: 'jvander', status: 'offline' }
      ])

    const loggedInUser = Cookies.get("username");
    
    // behavior
    useEffect(() =>  {
        const getAllOnlineUsers = async () => {
          try {
            const data =  await PlayerService.getAllOnlineUsers();
            if (data)
             setOnlinePlayers(data);
            // console.log(data);
          } catch (err: any) {}}
          getAllOnlineUsers();
        const getAllOfflineUsers = async () => {
          try {
            const data =  await PlayerService.getAllOfflineUsers();
            if (data)
             setOfflinePlayers(data);
            // console.log(data);
          } catch (err: any) {}}
          getAllOfflineUsers();
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
                    <div className="flex-shrink-0 p-4 border bg-gray-100 m-2">
                        <h1 className="text-lg font-bold mb-2 text-gray-600">Players on server</h1>
                    </div>
                    <div className="flex-shrink-0 p-4 bg-gray-100 m-2">
                        <p className="text-base mb-1 text-gray-600">Online</p>
                    </div>
                    <div className="flex flex-col text-black space-y-4">
                        {onlinePlayers!.map(onlinePlayer => (
                            onlinePlayer.username !== loggedInUser && onlinePlayer.status === 'online' && <div key={onlinePlayer.username} >
                                <DropdownButton { ...{ player: onlinePlayer, text: '', channel: selectedChannel } } />
                            </div>
                        ))}
                    </div>
                    <div className="flex-shrink-0 p-4 bg-gray-100 m-2">
                        <p className="text-base mb-1 text-gray-600">Offline</p>
                    </div>
                    <div className="flex flex-col text-black space-y-4">
                        {offlinePlayers!.map(offlinePlayer => (
                            offlinePlayer.username !== loggedInUser && offlinePlayer.status === 'offline' && <div key={offlinePlayer.username} >
                                <DropdownButton { ...{ player: offlinePlayer, text: '', channel: selectedChannel } } />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

}

export default PlayersOnServer;