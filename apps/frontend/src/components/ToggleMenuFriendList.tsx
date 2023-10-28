import { MenuItem, SubMenu } from "@szhsin/react-menu";
import {  IUserUsername } from "../types/types";
import { NavLink } from "react-router-dom";
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import { PlayerService } from "../services/player.service";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { RootState, store } from "../store/store";
import { useSelector } from "react-redux";
import { removeFriend } from "../store/user/friendsSlice";


function ToggleMenuFriendList(user: IUserUsername) {

    //state
    const users = useSelector((state: RootState) => state.allUser.users);
    //behaviour
    
    const deleteFriend = async () => {
        try {
            const receiverId = await PlayerService.getInfoUser(Cookies.get('username')!);
            if (!receiverId)
                return toast.error("User doesn't exists !");
            const senderId = await PlayerService.getInfoUser(user.username);
            if (!senderId)
                return toast.error("Friend to remove doesn't exist !");
            const data =  await PlayerService.removeFriend({receiverId, senderId});
            if (data)
            {
                const sender = users.filter((elem) => elem.id === senderId)[0];
                const senderUserUsername: IUserUsername = {
                    username: sender.username,
                    status: sender.status,
                };
                store.dispatch(removeFriend(senderUserUsername));
                toast.success("friend successfully deleted");
            }
        } catch (err: any) {
          const error = err.response?.data.message;
        }
      }


    //render
    return (
        <div className="bg-gray-500">
            <SubMenu direction={"left"} label={user.username}>
            <div className="bg-gray-500">
                <MenuItem>
                    <NavLink to={"player/" + user.username}>View Profile</NavLink>
                </MenuItem>
            </div>
            <div className="bg-gray-500">
                <MenuItem>Direct message</MenuItem>
            </div>
            <div className="bg-gray-500">
                <MenuItem>Invite to game</MenuItem>
            </div>
            <div className="bg-gray-500">
                <MenuItem onClick={() => deleteFriend()}>Remove friend</MenuItem>
            </div>
            </SubMenu>
        </div> 
    );

}
export default ToggleMenuFriendList;