import { useState, useEffect } from 'react';
import { IChannel, IResponseUser } from '../../../types/types';
import { useSelector } from 'react-redux';
import { RootState, store } from '../../../store/store';
import { useChatWebSocket } from '../../../context/chat.websocket.context';
import { fetchChannel } from '../../../store/channel/channelSlice';
import PlayerMenu from './PlayerMenu';
import { addBanned } from '../../../store/channel/banSlice';
import { addAdmin, fetchAdmin, removeAdmin } from '../../../store/channel/adminSlice';

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

    const channels = useSelector((state: RootState) => state.channel.channel);
    
    useEffect(() => {

        if (selectedChannel) {
            const channel = channels.filter((elem)=>elem.id===selectedChannel?.id)[0];
            setUsersOfChannel(channel.users);
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
                store.dispatch(fetchChannel());
            });
            webSocketService.on("userBanned",(payload: any) => {
                store.dispatch(addBanned(payload.user));
            });
            webSocketService.on("adminAdded", (payload: any) => {
                store.dispatch(addAdmin(payload.user));
            });
            webSocketService.on("adminRemoved", (payload: any) => {
                store.dispatch(removeAdmin(payload.user));
            });
            
            return () => {
                webSocketService.off('userLeft');
                webSocketService.off('userJoined');
                webSocketService.off('DmChannelJoined');
                webSocketService.off('userBanned');
                webSocketService.off('adminAdded');
                webSocketService.off('adminRemoved');
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
                            {usersOfChannel?.map((user) => (
                                user.id !== userConnected!.id && isOnline(user) &&  
                                <li key={user.id}>
                                    {selectedChannel && <PlayerMenu {...{user, selectedChannel}}></PlayerMenu>}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex-shrink-0 p-4 bg-gray-100 m-2">
                        <p className="text-xl mb-1 text-gray-600">Offline</p>
                        <hr/>
                        <ul className='text-black'>
                            {usersOfChannel?.map((user) => (
                                user.id !== userConnected!.id && isOffline(user) &&  
                             <li key={user.id}>
                                {selectedChannel && <PlayerMenu {...{user, selectedChannel}}></PlayerMenu>}
                            </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default PlayersOnChannel;