import { useState, useEffect } from "react";
import { RootState, store } from "../../../store/store";
import AddChannelModal from "./AddChannelModal";
import { useChatWebSocket } from "../../../context/chat.websocket.context";
import { addChannel } from "../../../store/channel/channelSlice";
import { IChannel, IUserUsername } from "../../../types/types";
import { useSelector } from "react-redux";
import { blockUser } from "../../../store/user/userSlice";
import { PlayerService } from "../../../services/player.service";
import { addBlocked } from "../../../store/blocked/blockedSlice";

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

    const handleBlockUser = async () => {
      const payload = {
        senderId: user.user!.id,
        receiverId: 3,
      }
      console.log('payload', payload);
      PlayerService.blockUser(payload);
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
        //   console.log('event DmChannelJoined received:', payload.users);
          store.dispatch(addChannel(payload));
        });
        return () => {
          webSocketService.off('DmChannelJoined');
        };
      }, []);

      useEffect(() => {
        webSocketService.on('userBlocked', (payload: IUserUsername) => {
          console.log('blocked redux state (AddChannel)', blocked);
          if (status === 'fulfilled')
            store.dispatch(addBlocked(payload));
        })
        return () => {
          webSocketService.off('userBlocked');
        }
      }, []);
    
    /* RENDER */
    return (
    <div>
      <div>
        <button
        className="bg-pink-500 text-white p-3 rounded-r-lg"
        onClick={handleBlockUser}>Block user</button>
      </div>
        <button className="bg-blue-500 text-white p-3 rounded-r-lg" onClick={handleOpenModal}>Add channel</button>
        {modalView &&
        <AddChannelModal onClose={handleCloseModal} />
        }
    </div>
    )
}

export default AddChannel;