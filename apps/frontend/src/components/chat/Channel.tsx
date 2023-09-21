import AddChannel from "./AddChannel";
import { useEffect, useState } from 'react';
import { instance } from '../../api/axios.api'
// import { useAppSelector } from "../store/hooks";
// import { RootState } from "../store/store";
import Cookies from "js-cookie";
import { IChannel, IGetChannels, IResponseChannelData } from "../../types/types";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { store } from "../../store/store";
import { setChannel } from "../../store/channel/channelSlice";

interface ChildProps {
    onSelectChannel: (channel: IChannel) => void;
}


const Channels: React.FC<ChildProps> = ({onSelectChannel}) => {
    // const user = useAppSelector((state: RootState) => state.user.user);
    /* Use useSelector() hook to access the channel state in the Redux store */
    const channels: IResponseChannelData[] = useSelector((state: RootState) => state.channel);
    console.log('channels', channels);
    
    /* STATE */
    // const [data, setData] = useState([]);
    
    /* BEHAVIOR */
    /* useEffect() hook: 2nd arg. is [] so that useEffect is executed only once, when the React component is mounted
    ** later it should be changed as the useEffect should be called when a new channel is added 
    ** setData set the fetched data into the local state */
    useEffect(() => {
        const user = Cookies.get('username');
        if (user) {
            const username: string = user;
            const channels: IGetChannels = {
                username: username,
            }
            const fetchData = async () => {
                const result = await instance.get('channel/', {params: {channels}});
                console.log('result.data', result.data);
                store.dispatch(setChannel(result.data));
            }
            fetchData();
        }
    }, []);
    
    console.log('channels', channels);
    /* RENDER */
    /* Destructuring of the data array is used with the map method */
    return (   
        <div className="flex flex-col items-stretch justify-center h-screen bg-gray-100 w-full">
                <div className="flex flex-grow w-full">
                    <div className="flex flex-col flex-1 p-4 border bg-gray-100 m-2">
                        <div className="flex-shrink-0 p-4 border bg-gray-100 m-2">
                            <h1 className="text-lg font-bold mb-2 text-gray-600">Channels</h1>
                            <div className="flex flex-col text-black space-y-4">
                                {/* {data.map(({name, id}) => ( */}
                                {channels.map((channel: IChannel) => (
                                // console.log(cha)
                                <button
                                key={channel.id}
                                onClick={() => onSelectChannel(channel)} 
                                /* use arrow function to pass parameter + explicitly passing event to the function */
                                // onClick={event => handleJoinChannel(event, id)} 
                                className="bg-blue-300 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">{channel.name}
                                </button>))}
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