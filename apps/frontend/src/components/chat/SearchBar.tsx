import { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useWebSocket } from "../../context/WebSocketContext";
import { store } from "../../store/store";
import { addNewUser } from "../../store/channel/channelSlice";

export default function SearchBar() {
    
    const webSocketService = useWebSocket();
    const user = useSelector((state: RootState) => state.user.username);
    
    /* state */
    const [ input, setInput ] = useState<string>("");
    const channels = useSelector((state: RootState) => state.channel.channel);

    const filteredData = channels.filter((el) => {
        if (input === '')
            return el;
        else
            return el.name.toLowerCase().match("^" + input);
    })
    
    //behaviour

    const handleJoinChannel = async (id: number) => {
        try{
            const payload = {
                channelId: id,
                username: user,
            }
            webSocketService.emit('onChannelJoin', payload);
            // store.dispatch(addNewUser());

        } catch(err: any) {
            console.log('join channel failed');
        }
    }

    useEffect(() => {
        webSocketService.on('userJoined', (payload: any) => {
            console.log('user', payload.username, 'joined', payload.channelId);
            store.dispatch(addNewUser(payload));
        })
        return () => {
            webSocketService.off('userJoined');
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
            <ul>
                {(input !== "") && filteredData.map((item) => (
                    <li key={item.id}>{item.name}
                    <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded focus:outline-none focus:shadow-outline" 
                    onClick={e=>handleJoinChannel(item.id)}>Join
                    </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}  
