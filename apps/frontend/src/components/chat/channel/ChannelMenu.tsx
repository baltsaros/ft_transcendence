import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { useSelector } from "react-redux";
import { RootState, store } from "../../../store/store";
import { instance } from "../../../api/axios.api";
import { removeUser } from "../../../store/channel/channelSlice";
import { toast } from "react-toastify";

interface ChildProps {
  channelId: number;
}

const ChannelMenu: React.FC<ChildProps> = ({channelId}) => {
  const userLogged = useSelector((state: RootState) => state.user);  
  
  /* STATE */

    /* BEHAVIOUR */
    const handleLeaveChannel = async(id: number) => {
      try{
          const payload = {
              channelId: id,
              username: userLogged.username,
          }
          const response = await instance.post("channel/leaveChannel", payload);
          // webSocketService.emit('onChannelLeave', payload);
          if (response)
              store.dispatch(removeUser(payload));
      } catch(error: any) {
          const err = error.response?.data.message;
          toast.error(err.toString());
      }
  }

  const handleManagePassword = async() => {
    
  }
    
    /* RENDER */
    return (
      <div className="text-black bg-blue-500 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none relative">
        <Menu direction={"right"} arrow={true} align={"center"} menuButton={<MenuButton className="text-sm w-1">...</MenuButton>}>
          <div className="bg-gray-500">
            <MenuItem onClick={() => handleLeaveChannel(channelId)}>Leave Channel</MenuItem>
            <MenuItem onClick={handleManagePassword}>Manage Password</MenuItem>
          </div>
        </Menu>
      </div>
    );
}

export default ChannelMenu;