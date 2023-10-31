import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { useSelector } from "react-redux";
import { RootState, store } from "../../../store/store";
import { instance } from "../../../api/axios.api";
import { removeUser } from "../../../store/channel/channelSlice";
import ManagePswdModal from "./ManagePswdModal";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { IChannel } from "../../../types/types";

interface ChildProps {
  channel: IChannel;
  onSelectChannel: (channel: IChannel | null) => void;
}

const ChannelMenu: React.FC<ChildProps> = ({channel, onSelectChannel}) => {
  const userLogged = useSelector((state: RootState) => state.user);  
  
  /* STATE */
  const [modalView, setModalView] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const handleOpenModal = () => {
      setModalView(true);
  }
  
  const handleCloseModal = () => {
      setModalView(false);
  }

  useEffect(() => {
    if (channel.owner.username === userLogged.username) {
      setIsOwner(true);
    }
  }, []);

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
          onSelectChannel(null);
        }
    } catch(error: any) {
        const err = error.response?.data.message;
        toast.error(err.toString());
    }
}

    /* RENDER */
    return (
      <div className="text-center">
        <Menu direction={"right"} arrow={true} align={"center"} menuButton={<MenuButton className="bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-lg text-sm">+</MenuButton>}>
          <div className="bg-gray-500">
            <MenuItem onClick={() => handleLeaveChannel(channel.id)}>Leave Channel</MenuItem>
            {isOwner &&
            <MenuItem onClick={handleOpenModal}>Manage Password</MenuItem>}
          </div>
        </Menu>
        {modalView && <ManagePswdModal onClose={handleCloseModal} channel={channel} />}
      </div>
    );
}

export default ChannelMenu;