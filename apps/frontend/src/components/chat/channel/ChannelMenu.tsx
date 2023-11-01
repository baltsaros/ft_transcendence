import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { useSelector } from "react-redux";
import { RootState, store } from "../../../store/store";
import { instance } from "../../../api/axios.api";
import { removeOwner, removeUser } from "../../../store/channel/channelSlice";
import ManagePswdModal from "./ManagePswdModal";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { IChannel } from "../../../types/types";
import { useChannel } from "../../../context/selectedChannel.context";
import { useChatWebSocket } from "../../../context/chat.websocket.context";

interface ChildProps {
  channel: IChannel;
  // onSelectChannel: (channel: IChannel | null) => void;
}

const ChannelMenu: React.FC<ChildProps> = ({channel }) => {
// const ChannelMenu: React.FC<ChildProps> = ({channel, onSelectChannel}) => {
  const userLogged = useSelector((state: RootState) => state.user); 
  const selectedChannelContext = useChannel();
  const webSocketService = useChatWebSocket();
  
  /* STATE */
  const [modalView, setModalView] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  // console.log('channel owner', selectedChannelContext.selectedChannel?.owner);
  // console.log('channel admins', selectedChannelContext.selectedChannel?.);

  const handleOpenModal = () => {
      setModalView(true);
  }
  
  const handleCloseModal = () => {
      setModalView(false);
  }

  useEffect(() => {
    if (webSocketService) {
      console.log('here');
      webSocketService.on("ownerLeft", (payload: any) => {
        store.dispatch(removeOwner(payload));
        console.log('channel.owner.username', channel.owner.username);
          setIsOwner(false);
      });
      return () => {
        webSocketService.off("ownerLeft");
      };
    }
  }, []);

  // useEffect(() => {
  //   // console.log('')
  //   if (channel.owner.username === userLogged.username) {
  //     setIsOwner(true);
  //   }
  // }, []);



    /* BEHAVIOUR */
  const handleLeaveChannel = async(id: number) => {
    try{
        const payload = {
            channelId: id,
            username: userLogged.username,
        }
        const response = await instance.post("channel/leaveChannel", payload);
        if (response) {
          store.dispatch(removeUser(payload));
          selectedChannelContext.setSelectedChannel(null);
        }
    } catch(error: any) {
        const err = error.response?.data.message;
        toast.error(err.toString());
    }
}

    /* RENDER */
    return (
      <div className="text-center">
        <Menu direction={"right"} arrow={true} align={"center"} menuButton={<MenuButton className="bg-gray-500 rounded-lg hover:bg-gray-600 text-white p-3 text-sm">+</MenuButton>}>
          <div className="bg-gray-500">
            <MenuItem onClick={() => handleLeaveChannel(channel.id)}>Leave Channel</MenuItem>
            {channel.owner.username === userLogged.username &&
            <MenuItem onClick={handleOpenModal}>Manage Password</MenuItem>}
          </div>
        </Menu>
        {modalView && <ManagePswdModal onClose={handleCloseModal} channel={channel}/>}
      </div>
    );
}

export default ChannelMenu;