import AddChannel from "./AddChannel";
import { useEffect } from 'react';
import { IChannel } from "../../../types/types";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { store } from "../../../store/store";
import { fetchChannel, removeUser } from "../../../store/channel/channelSlice";
import { useChatWebSocket } from "../../../context/chat.websocket.context";
import SearchBar from "./SearchBar";
import ChannelMenu from "./ChannelMenu"
import { instance } from "../../../api/axios.api";
import { toast } from "react-toastify"
import Scrollbar from "react-scrollbars-custom";

interface ChildProps {
    onSelectChannel: (channel: IChannel) => void;
}

const Channels: React.FC<ChildProps> = ({onSelectChannel}) => {
    const webSocketService = useChatWebSocket();
    const channels = useSelector((state: RootState) => state.channel.channel);
    const userLogged = useSelector((state: RootState) => state.user);
    const blocked = useSelector((state: RootState) => state.blocked);
    const status = useSelector((state: RootState) => state.blocked.status);

    // console.log('channels:', channels);
    
    const filteredChannels = channels.filter((channel) => 
        channel.users.some((user) =>
            user.username === userLogged.username
        )
    )
    
    /* STATE */

    /* BEHAVIOR */
    const handleLeaveChannel = async(id: number) => {
        try{
            const payload = {
                channelId: id,
                username: userLogged.username,
            }
            const response = await instance.post("channel/leaveChannel", payload);
            // webSocketService.emit('onChannelLeave', payload);
            if (response)
                store.dispatch(removeUser(payload));
        } catch(error: any) {
            const err = error.response?.data.message;
            toast.error(err.toString());
        }
    }
    useEffect(() => {
        store.dispatch(fetchChannel());
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
                                <div className="flex flex-col text-black space-y-4">
                                    <Scrollbar style={{ width: 300, height: 300 }}>
                                        {filteredChannels.map((channel: IChannel) => (
                                        <div key={channel.id} className="flex items-center justify-between mb-2">
                                        <div className="flex items-center bg-gray-500 rounded-lg">
                                        	<button
                                        		onClick={() => onSelectChannel(channel)}
                                        		className="bg-gray-500 hover:bg-gray-600 text-white p-3 ">{channel.name}
                                        	</button>
                                        	<ChannelMenu channel={channel}/>
                                        </div>
                                        </div>
                                        ))}
                                    </Scrollbar>
                                </div>
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