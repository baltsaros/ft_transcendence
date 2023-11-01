import { useEffect, useState } from "react";
import { instance } from "../../api/axios.api";
import { IChannel, IMessage } from "../../types/types";
import { useAppSelector } from "../../store/hooks";
import { RootState, store } from "../../store/store";
import { toast } from "react-toastify"
import { fetchMuted } from "../../store/channel/mutedSlice";
import { useChannel } from "../../context/selectedChannel.context";

// interface ChildProps {
//     selectedChannel: IChannel | null;
// }

function ChatBar() {
// const ChatBar: React.FC<ChildProps> = ({selectedChannel}) => {

    const user = useAppSelector((state: RootState) => state.user.user);
    const muted = useAppSelector((state: RootState) => state.muted.users);
    const selectedChannelContext = useChannel();
    
    /* STATE */
    const [newMessage, setMessage] =  useState("");

    const isMuted = () => {
        if (user)
            return (muted.some((elem) => elem.id === user.id));
        return (true);
    }

    /* BEHAVIOR */
    /* IMessage type on undefined because useState can be null (TBD)*/
    const handleClick = async () => {
        const message: IMessage = {
            channelId: selectedChannelContext.selectedChannel!.id,
            user: user!,
            content: newMessage,
        };
        if (message.content.length === 0)
        {
            toast.error("Enter a value");
            return; 
        }
        await instance.post('message', message);
        setMessage('');
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    }

    const handleKeyDown = (event: any) => {
        if (event.key == "Enter")
        {
            handleClick();
        }
    }

    useEffect(() => {
        if (selectedChannelContext.selectedChannel)
            store.dispatch(fetchMuted(selectedChannelContext.selectedChannel.id));
    }, [])

    /* RENDER */
    return (
        <div className="flex text-black items-center bg-gray-200 p-2">
            {isMuted() && <div><input
                value={newMessage}
                type="text" 
                placeholder="You're muted"
                disabled
                className="flex-grow p-2 border rounded-lg"
                />
                <button disabled className="bg-gray-500 text-gray p-3 rounded-lg">Send</button></div>}
            
            {!isMuted() && <div>
            <input
            value={newMessage}
            type="text" 
            placeholder="Type your message..."
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="flex-grow p-2 border rounded-lg"
            />
        <button className="bg-gray-500 hover:bg-gray-600 text-gray p-3 rounded-lg" onClick={handleClick}>Send</button></div>}
        </div>
    );
}

export default ChatBar;