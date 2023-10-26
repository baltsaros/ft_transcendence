import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { Scrollbar } from 'react-scrollbars-custom';
import { useChatWebSocket } from "../../../context/chat.websocket.context";
import { store } from "../../../store/store";
import { addNewUser } from "../../../store/channel/channelSlice";
import { IChannel, IResponseUser } from "../../../types/types";
import { IconBaseProps } from "react-icons/lib";

export default function SearchBar() {
    
    const webSocketService = useChatWebSocket();
    const userLogged = useSelector((state: RootState) => state.user);
    
    /* STATE */
    const [ input, setInput ] = useState<string>("");
    const channels = useSelector((state: RootState) => state.channel.channel);

    const isTrue = (user: IResponseUser) => {
        return user.intraId === userLogged.user?.intraId;
    }

    const filterFunction = (channel:IChannel) => {
        const isUserInChannel = channel.users.some(isTrue);
        return !isUserInChannel
    }

    const AccessibleChannel = channels.filter(filterFunction);    
    
    const filteredData = AccessibleChannel.filter((el) => {
        filterFunction(el);
        if (input === '')
            return el;
        else
            return el.name.toLowerCase().match("^" + input);
    })
    
    /* BEHAVIOUR */

    const handleChannelPassword = async(channel: IChannel) => {

    }

    const handleJoinChannel = async (channel: IChannel) => {
        let payload;
        try{
           
            payload = {
            channelId: channel.id,
            username: userLogged.username,
        }
            webSocketService.emit('onChannelJoin', payload);
            setInput("");
        } catch(err: any) {
            console.log('join channel failed');
        }
    }

    useEffect(() => {
        webSocketService.on('userJoined', (payload: any) => {
            console.log('user', payload.user.username, 'joined', payload.channelId);
            store.dispatch(addNewUser(payload));
        })
        return () => {
            webSocketService.off('userJoined');
        };
    }, []);

    useEffect(() => {
        webSocketService.on('userJoinedError', (payload: string) => {
            console.log('event received');
            alert(payload);
        })
        return () => {
            webSocketService.off('userJoinedError');
        };
    }, []);


    //render
    return (
        <div>
            <input
                type="search"
                className="relative flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                placeholder="Search"
                aria-label="Search"
                aria-describedby="button-addon1"
                onChange={(e) => setInput(e.target.value.toLocaleLowerCase())}
            />
            <Scrollbar style={{width: 250, height: 250}}>
                <div>
                {(input !== "") && filteredData.map((channel) => (
                    <div key={channel.id}>
                    <h3>{channel.name}</h3>
                    {/* <li key={channel.id}>{channel.name} */}
                    {/* <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded focus:outline-none focus:shadow-outline" 
                    onClick={() => handleJoinChannel(channel)}> */}
                    {channel.mode === 'Protected' ? (
                        <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded focus:outline-none focus:shadow-outline" 
                        onClick={() => handleChannelPassword(channel)}>Enter password
                        </button>
                        ): (
                            <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded focus:outline-none focus:shadow-outline" 
                            onClick={() => handleJoinChannel(channel)}>Join
                            </button>
                        )}
                    </div>
                ))}
        </div>
            </Scrollbar>
            </div>
    );
}  
