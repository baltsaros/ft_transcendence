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
import { useChannel } from "../../../context/selectedChannel.context";

// interface ChildProps {
//     onSelectChannel: (channel: IChannel | null) => void;
// }

function Channel() {
    const selectedChannelContext = useChannel();
// const Channel: React.FC<ChildProps> = ({onSelectChannel}) => {
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
			<div className="flex max-w-xs flex-col p-4 border rounded-lg bg-white m-6 shadow-md h-[80vh]">
			  <div className="p-4 bg-gray-200 rounded-lg">
			    <h1 className="text-2xl font-semibold mb-2 text-gray-800">Channels</h1>
			  </div>
			  <div className="flex flex-col text-gray-700 space-y-4 p-4">
			    <SearchBar />
			    <div className="flex flex-col space-y-2">
			      <Scrollbar style={{ width: 300, height: 300 }}>
			        {filteredChannels.map((channel: IChannel) => (
			          <div key={channel.id} className="flex items-center justify-between mb-2">
							<div className="flex items-center bg-gray-500 rounded-lg">
											<button
												onClick={() => selectedChannelContext.setSelectedChannel(channel)}
												// onClick={() => onSelectChannel(channel)}
												className="bg-gray-500 hover:bg-gray-600 text-white justify-center rounded-lg p-3 w-40">{channel.name}
											</button>
											<ChannelMenu
											channel={channel}
											// onSelectChannel={onSelectChannel}
											/>
							</div>
			          </div>
			        ))}
			      </Scrollbar>
			    </div>
			  </div>
			  <div className="mt-auto">
			    <AddChannel />
			  </div>
			</div>

    );
}

export default Channel;