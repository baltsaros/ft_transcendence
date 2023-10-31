import AddChannel from "./AddChannel";
import { useEffect } from 'react';
import { IChannel } from "../../../types/types";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { store } from "../../../store/store";
import { fetchChannel } from "../../../store/channel/channelSlice";
import SearchBar from "./SearchBar";
import ChannelMenu from "./ChannelMenu"
import Scrollbar from "react-scrollbars-custom";

interface ChildProps {
    onSelectChannel: (channel: IChannel | null) => void;
}

const Channels: React.FC<ChildProps> = ({onSelectChannel}) => {
    const channels = useSelector((state: RootState) => state.channel.channel);
    const userLogged = useSelector((state: RootState) => state.user);
    
    const filteredChannels = channels.filter((channel) => 
        channel.users.some((user) =>
            user.username === userLogged.username
        )
    )
    
    /* STATE */

    /* BEHAVIOR */
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
                                        		className="bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-lg">{channel.name}
                                        	</button>
                                        	<ChannelMenu 
                                            channel={channel}
                                            onSelectChannel={onSelectChannel}
                                            />
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