import { useState, useEffect } from "react";
import { store } from "../../../store/store";
import AddChannelModal from "./AddChannelModal";
import { useChatWebSocket } from "../../../context/chat.websocket.context";
import { addChannel } from "../../../store/channel/channelSlice";
import { useAppDispatch } from "../../../store/hooks";

function AddChannel () {

    const webSocketService = useChatWebSocket();
    const dispatch = useAppDispatch();
    /* STATE */
    const [modalView, setModalView] = useState(false);

     /* BEHAVIOUR */
    const handleOpenModal = () => {
        setModalView(true);
    }
    
    const handleCloseModal = () => {
        setModalView(false);
    }

    useEffect(() => {
        webSocketService.on('newChannelCreated', (payload: any) => {
            store.dispatch(addChannel(payload));
        });
        
        return () => {
            webSocketService.off('newChannelCreated');
          };
       }, []);
    
    /* RENDER */
    return (
    <div>
        <button className="bg-blue-500 text-white p-3 rounded-r-lg" onClick={handleOpenModal}>Add channel</button>
        {modalView &&
        <AddChannelModal onClose={handleCloseModal} />
        }
    </div>
    )
}

export default AddChannel;