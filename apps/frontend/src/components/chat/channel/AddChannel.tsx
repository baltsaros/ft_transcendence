import { useState, useEffect } from "react";
import { RootState, store } from "../../../store/store";
import AddChannelModal from "./AddChannelModal";
import { useChatWebSocket } from "../../../context/chat.websocket.context";
import { addChannel } from "../../../store/channel/channelSlice";
import { IChannel } from "../../../types/types";
import { useSelector } from "react-redux";

function AddChannel () {

    const webSocketService = useChatWebSocket();
    const user = useSelector((state: RootState) => state.user);
    const blocked = useSelector((state: RootState) => state.blocked);
    const status = useSelector((state: RootState) => state.blocked.status);
    // console.log('user', user);

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

       useEffect(() => {
        webSocketService.on('DmChannelJoined', (payload: IChannel) => {
          store.dispatch(addChannel(payload));
        });
        return () => {
          webSocketService.off('DmChannelJoined');
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