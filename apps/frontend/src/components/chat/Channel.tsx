import AddChannel from "./AddChannel";
import { useEffect } from 'react';
import { IChannel } from "../../types/types";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { store } from "../../store/store";
import { addChannel, fetchChannel, removeUser } from "../../store/channel/channelSlice";
import { useWebSocket } from "../../context/WebSocketContext";
import SearchBar from "./SearchBar";


interface ChildProps {
    onSelectChannel: (channel: IChannel) => void;
}

const Channels: React.FC<ChildProps> = ({onSelectChannel}) => {
    /* Use useSelector() hook to access the channel state in the Redux store */
    const webSocketService = useWebSocket();
    const channels = useSelector((state: RootState) => state.channel.channel);
    const userLogged = useSelector((state: RootState) => state.user.username);

    console.log('channels:', channels);
    const filteredChannels = channels.filter((channel) => 
        channel.users.some((user) =>
            user.username === userLogged
        )
    )
    console.log('filtered channels:', filteredChannels);
    
    /* STATE */
    
    /* BEHAVIOR */

    // const handleJoinChannel = async (id: number) => {
    //     try{
    //         const payload = {
    //             channelId: id,
    //             username: user,
    //         }
    //         console.log('channelId:', id);
    //         console.log(user);
    //         webSocketService.emit('onChannelJoin', payload);

    //     } catch(err: any) {
    //         console.log('join channel failed');
    //     }
    // }

    /* useEffect() hook: 2nd arg. is [] so that useEffect is executed only once, when the React component is mounted
    ** later it should be changed as the useEffect should be called when a new channel is added */
    // useEffect(() => {
    //     const user = Cookies.get('username');
    //     if (user) {
    //         const username: string = user;
    //         const channels: IGetChannels = {
    //             username: username,
    //         }
    //         const fetchData = async () => {
    //             const result = await instance.get('channel/', {params: {channels}});
    //             // console.log('Channel: channels fetched:', result.data);
    //             store.dispatch(setChannel(result.data));
    //         }
    //         fetchData();
    //     }
    // }, []);

    const handleLeaveChannel = async(id: number) => {
        const payload = {
            channelId: id,
            username: userLogged,
        }
        webSocketService.emit('onChannelLeave', payload);
    }
    useEffect(() => {
        store.dispatch(fetchChannel());
    }, []);

    
    // useEffect(() => {
    //     webSocketService.on('userJoined', (payload: any) => {
    //         console.log('user', payload.username, 'joined', payload.channelId);
    //     })
    //     return () => {
    //         webSocketService.off('userJoined');
    //     };
    // }, []);
    
    useEffect(() => {
        webSocketService.on('userLeft', (payload: any) => {
            console.log('user', payload.username, 'left', payload.channelId);
            store.dispatch(removeUser(payload));
        })
        return () => {
            webSocketService.off('userLeft');
        };
    }, []);
    
    /* RENDER */
    /* Destructuring of the data array is used with the map method */
    return (   
        <div className="flex flex-col items-stretch justify-center h-screen bg-gray-100 w-full">
                <div className="flex flex-grow w-full">
                    <div className="flex flex-col flex-1 p-4 border bg-gray-100 m-2">
                        <div className="flex-shrink-0 p-4 border bg-gray-100 m-2">
                            <h1 className="text-lg font-bold mb-2 text-gray-600">Channels</h1>
                            <div className="flex flex-col text-black space-y-4">
                                <SearchBar />
                                {filteredChannels.map((channel: IChannel) => (
                                <div key={channel.id}>
                                <button
                                /* use arrow function to pass parameter + explicitly passing event to the function*/
                                onClick={() => onSelectChannel(channel)} 
                                className="bg-blue-300 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">{channel.name}
                                </button>
                                <button 
                                className="bg-red-300 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded"
                                onClick={() => handleLeaveChannel(channel.id)}
                                >leave
                                </button>
                                </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-auto">
                            <AddChannel/>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default Channels;