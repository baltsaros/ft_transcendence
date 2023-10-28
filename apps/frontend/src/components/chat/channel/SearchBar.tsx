import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { Scrollbar } from 'react-scrollbars-custom';
import { useChatWebSocket } from "../../../context/chat.websocket.context";
import { store } from "../../../store/store";
import { updateChannelPassword, addNewUser } from "../../../store/channel/channelSlice";
import { IChannel, IChannelPassword, IResponseUser } from "../../../types/types";

export default function SearchBar() {
    
    const webSocketService = useChatWebSocket();
    const userLogged = useSelector((state: RootState) => state.user);
    
    /* STATE */
    const [ input, setInput ] = useState<string>("");
    const [passwordInput, setPasswordInput] = useState<string>("");
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

    const handleChannelPassword = (channel: IChannel) => {
        console.log('channel', channel);
        console.log('password', passwordInput);
        try {
            const payload = {
                channelId: channel.id,
                username: userLogged.username,
                password: passwordInput,
            }
            webSocketService.emit('onChannelJoin', payload);
            setPasswordInput('');
        } catch(err: any) {
            console.log('join channel failed');
        }
    };

    const handleJoinChannel = async (channel: IChannel) => {
        console.log('channel', channel);
        try{
            const payload = {
            channelId: channel.id,
            username: userLogged.username,
        }
            webSocketService.emit('onChannelJoin', payload);
            setInput('');
        } catch(err: any) {
            console.log('join channel failed');
        }
    };

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

    useEffect(() => {
        webSocketService.on('setChannelPassword', (payload: IChannelPassword) => {
            console.log('ws event received');
            store.dispatch(updateChannelPassword(payload));
        })
        return () => {
            webSocketService.off('setChannelPassword');
        };
    }, []);


    /* RENDER */
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
                    {channel.mode === 'Private' ? (
                    <div>
                        <input
                            type="password"
                            placeholder="Enter the channel password"
                            onChange={(e) => setPasswordInput(e.target.value)}
                        />
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded focus:outline-none focus:shadow-outline"
                            onClick={() => handleChannelPassword(channel)}
                        >Join
                        </button>
                    </div>
                ) : (
                    // Condition for public channels
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded focus:outline-none focus:shadow-outline"
                        onClick={() => handleJoinChannel(channel)}
                    >Join
                    </button>
                )}
                </div>
                ))}
            </div>
            </Scrollbar>
            </div>
    );
}  
