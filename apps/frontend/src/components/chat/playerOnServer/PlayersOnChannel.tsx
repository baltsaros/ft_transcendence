import { useState, useEffect } from 'react';
import { IChannel, IResponseUser } from '../../../types/types';
import { instance } from '../../../api/axios.api';
import { useSelector } from 'react-redux';
import { RootState, store } from '../../../store/store';
import { useChatWebSocket } from '../../../context/chat.websocket.context';
import { fetchChannel } from '../../../store/channel/channelSlice';
import PlayerMenu from './PlayerMenu';
import AdminMenu from './AdminMenu';

interface ChildProps {
    selectedChannel: IChannel | null;
}

const PlayersOnChannel: React.FC<ChildProps> = ({selectedChannel}) => {
    
    const webSocketService = useChatWebSocket();

    // behavior
    const [usersOfChannel, setUsersOfChannel] = useState<IResponseUser[]>();
    const isOnline = (value: IResponseUser) => value.status === 'online';
    const isOffline = (value: IResponseUser) => value.status === 'offline';
    const userConnected = useSelector((state: RootState) => state.user.user);

    const channels = useSelector((state: RootState) => state.channel);
    
    useEffect(() => {

        if (selectedChannel)
        {
            const fetchUsers = async () => {
                const channel = await instance.post<IChannel>('channel/getChannelById/', {idChannel: selectedChannel.id});
                setUsersOfChannel(channel.data.users);
            }
            fetchUsers();
        }
    }, [selectedChannel, channels]);

    useEffect(() => {
            webSocketService.on("userLeft", (payload: any) => {
                store.dispatch(fetchChannel());
            });
            webSocketService.on("userJoined", (payload: any) => {
                store.dispatch(fetchChannel());
            });
            webSocketService.on("DmChannelJoined", (payload: any) => {
                console.log("emitos");
                store.dispatch(fetchChannel());
            });
            return () => {
                webSocketService.off('newUpdateStatus');
                    };
    }, []);

    // render
    return (
        <div className="flex flex-col items-stretch justify-center h-screen bg-gray-100 w-full">
            <div className="flex flex-grow w-full">
                <div className="flex-1 p-4 border bg-gray-100 m-2">
                    <div className="flex-shrink-0 p-4 border bg-gray-100 m-2">
                        <h1 className="text-lg font-bold mb-2 text-gray-600">Players on channel</h1>
                    </div>
                    <div className="flex-shrink-0 p-4 bg-gray-100 m-2">
                        <p className="text-xl mb-1 text-gray-600">Online</p>
                        <hr/>
                        <ul className='text-black'>
                            {usersOfChannel?.map((elem) => (
                                elem.id !== userConnected!.id && elem.status === "online" &&  
                                <li key={elem.id}><AdminMenu {...elem}></AdminMenu></li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex-shrink-0 p-4 bg-gray-100 m-2">
                        <p className="text-xl mb-1 text-gray-600">Offline</p>
                        <hr/>
                        <ul className='text-black'>
                            {usersOfChannel?.map((elem) => (
                                elem.id !== userConnected!.id && elem.status === "offline" &&  
                                <li key={elem.id}><AdminMenu {...elem}></AdminMenu></li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>

    );
    // return (
        // <div className="flex flex-col items-stretch justify-center h-screen bg-gray-100 w-full">
        //     <div className="flex flex-grow w-full">
        //         <div className="flex-1 p-4 border bg-gray-100 m-2">
        //             <div className="flex-shrink-0 p-4 border bg-gray-100 m-2">
        //                 <h1 className="text-lg font-bold mb-2 text-gray-600">Players on server</h1>
        //             </div>
        //             <div className="flex-shrink-0 p-4 bg-gray-100 m-2">
        //                 <p className="text-base mb-1 text-gray-600">Online</p>
        //             </div>
        //             <div className="flex flex-col text-black space-y-4">
        //                 {onlinePlayers!.map(onlinePlayer => (
        //                     onlinePlayer.username !== loggedInUser && onlinePlayer.status === 'online' && <div key={onlinePlayer.username} >
        //                         <DropdownButton { ...{ player: onlinePlayer, text: '', channel: selectedChannel } } />
        //                     </div>
        //                 ))}
        //             </div>
        //             <div className="flex-shrink-0 p-4 bg-gray-100 m-2">
        //                 <p className="text-base mb-1 text-gray-600">Offline</p>
        //             </div>
        //             <div className="flex flex-col text-black space-y-4">
        //                 {offlinePlayers!.map(offlinePlayer => (
        //                     offlinePlayer.username !== loggedInUser && offlinePlayer.status === 'offline' && <div key={offlinePlayer.username} >
        //                         <DropdownButton { ...{ player: offlinePlayer, text: '', channel: selectedChannel } } />
        //                     </div>
        //                 ))}
        //             </div>
        //         </div>
        //     </div>
        // </div>
    // );

}

export default PlayersOnChannel;